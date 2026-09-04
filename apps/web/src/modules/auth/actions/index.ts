"use server"

import { signIn } from "@/auth"
import config from "@/lib/config"
import { AuthError } from "next-auth"

export const signInWithCredentials = async (
  params: Pick<AuthCredentials, "email" | "password">
) => {
  const { email, password } = params

  try {
    // First check whether this account still needs a password to be created
    // (created by an admin, no password set yet). If so, prompt the user to
    // create one instead of showing an invalid-credentials error.
    const checkResponse = await fetch(`${config.env.baseUrl}/auth/sign-in`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })

    if (checkResponse.ok) {
      const checkData = await checkResponse.json()
      if (checkData?.requiresPasswordSetup) {
        return {
          success: false,
          requiresPasswordSetup: true,
          email: checkData.email,
          setupToken: checkData.setupToken,
        }
      }
    }

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    })

    if (result?.error) {
      return {
        success: false,
        error: result.error,
      }
    }

    return { success: true }
  } catch (error) {
    // Handle specific AuthError or other errors
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return {
            success: false,
            error: "Invalid credentials",
          }
        default:
          return {
            success: false,
            error: error.message || "Something went wrong",
          }
      }
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : "Something went wrong",
    }
  }
}

export const setPassword = async (
  params: Pick<AuthCredentials, "verificationToken" | "password">
) => {
  const { verificationToken, password } = params

  // try {
  //   // Prepare the payload
  //   const payload = {
  //     verificationToken, // Use the id as the verification token
  //     password, // Send the password
  //   };
  //   console.log({ payload });

  //   // Replace with your actual API endpoint
  //   const response = await fetch(
  //     `${config.env.baseUrl}/auth/set-password`,
  //     {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(payload),
  //     }
  //   );

  //   const result = await response.json();

  //   if (!response.ok) {
  //     throw new Error(
  //       result.error || 'Failed to set password'
  //     );
  //   }

  //   console.log(
  //     'Password Set Successful:',
  //     result
  //   );

  //   const email = result.email;
  //   // Step 3: Sign in the user with the credentials (after successful registration)
  //   const signInResult =
  //     await signInWithCredentials({
  //       email,
  //       password,
  //     });

  //   if (!signInResult.success) {
  //     return {
  //       success: false,
  //       error:
  //         signInResult.error ||
  //         'Sign-in failed. Please check your credentials.',
  //     };
  //   }

  //   // If everything is successful
  //   return { success: true };
  // } catch (error) {
  //   console.error(
  //     'Error during password set:',
  //     error
  //   );

  //   return {
  //     success: false,
  //     error:
  //       error instanceof Error
  //         ? error.message
  //         : 'An unexpected error occurred during signup.',
  //   };
  // }

  try {
    const payload = {
      verificationToken, // Use the id as the verification token
      password, // Send the password
    }
    console.log({ payload })

    // Replace with your actual API endpoint
    const response = await fetch(`${config.env.baseUrl}/auth/set-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })

    const result = await response.json()

    // Step 2: Check for errors in the registration response
    if (!response.ok) {
      return {
        success: false,
        error: result.message || "Failed to set password, please try again",
      }
    }

    // Step 3: Sign in the user with the credentials (after successful
    // password set)

    const email = result.email

    const signInResult = await signInWithCredentials({
      email,
      password,
    })

    if (!signInResult.success) {
      return {
        success: false,
        error:
          signInResult.error ||
          "Sign-in failed. Please check your credentials.",
      }
    }

    // If everything is successful
    return { success: true }
  } catch (error) {
    // General error handling
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "An unexpected error occurred during password set.",
    }
  }
}

export const setFirstLoginPassword = async (
  params: Pick<AuthCredentials, "setupToken" | "password" | "email">
) => {
  const { setupToken, password } = params

  try {
    const response = await fetch(
      `${config.env.baseUrl}/auth/first-login-set-password`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ setupToken, password }),
      }
    )

    const result = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: result.message || "Failed to create password, please try again",
      }
    }

    const email = result.email

    const signInResult = await signInWithCredentials({
      email,
      password,
    })

    if (!signInResult.success) {
      return {
        success: false,
        error:
          signInResult.error ||
          "Sign-in failed. Please check your credentials.",
      }
    }

    return { success: true }
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "An unexpected error occurred during password setup.",
    }
  }
}

export const resetPassword = async (
  params: Pick<AuthCredentials, "verificationToken" | "password">
) => {
  const { verificationToken, password } = params

  try {
    // Prepare the payload
    const payload = {
      verificationToken, // Use the id as the verification token
      password, // Send the password
    }
    console.log({ payload })

    // Replace with your actual API endpoint
    const response = await fetch(`${config.env.baseUrl}/auth/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })

    const result = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: result.message || "Failed to reset password, please try again",
      }
    }

    const email = result.email

    const signInResult = await signInWithCredentials({
      email,
      password,
    })

    if (!signInResult.success) {
      return {
        success: false,
        error:
          signInResult.error ||
          "Sign-in failed. Please check your credentials.",
      }
    }

    // If everything is successful
    return { success: true }
  } catch (error) {
    // General error handling
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "An unexpected error occurred during password reset.",
    }
  }
}

export const forgotPassword = async (
  params: Pick<AuthCredentials, "email">
) => {
  const { email } = params

  try {
    // Prepare the payload
    const payload = {
      email,
    }
    console.log({ payload })

    // Replace with your actual API endpoint
    const response = await fetch(`${config.env.baseUrl}/auth/forgot-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })

    const result = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: result.message || "Failed to reset password, please try again",
      }
    }

    // If everything is successful
    return { success: true }
  } catch (error) {
    // General error handling
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "An unexpected error occurred during password reset.",
    }
  }
}
