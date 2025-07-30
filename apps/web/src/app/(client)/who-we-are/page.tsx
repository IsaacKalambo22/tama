import HeaderText from "@/modules/common/header-text"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Who We Are - TAMA Farmers Trust",
  description:
    "Learn about TAMA Farmers Trust, our mission, vision, and commitment to the tobacco farming community.",
}

const WhoWeArePage = () => {
  return (
    <div className="flex w-full flex-col gap-10 mb-16">
      <HeaderText
        title="Who We Are"
        subtitle="Discover our story, mission, and commitment to tobacco farmers"
      />

      <div className="max-w-4xl mx-auto px-6 space-y-8">
        {/* Mission Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-800">Our Mission</h2>
          <p className="text-gray-700 leading-relaxed">
            TAMA Farmers Trust is dedicated to empowering tobacco farmers
            through sustainable practices, education, and community support. We
            strive to create a thriving agricultural sector that benefits both
            farmers and the broader economy.
          </p>
        </section>

        {/* Vision Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-800">Our Vision</h2>
          <p className="text-gray-700 leading-relaxed">
            To be the leading organization in tobacco farming excellence,
            fostering innovation, sustainability, and prosperity for all
            stakeholders in the tobacco industry.
          </p>
        </section>

        {/* Values Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-800">Our Values</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-800">
                Sustainability
              </h3>
              <p className="text-gray-700">
                We promote environmentally responsible farming practices that
                ensure long-term viability of the land and resources.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-800">Community</h3>
              <p className="text-gray-700">
                We believe in building strong, supportive communities that
                uplift all members and create lasting partnerships.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-800">
                Innovation
              </h3>
              <p className="text-gray-700">
                We embrace new technologies and methods that improve efficiency,
                quality, and profitability for our farmers.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-800">Integrity</h3>
              <p className="text-gray-700">
                We operate with transparency, honesty, and ethical practices in
                all our dealings and relationships.
              </p>
            </div>
          </div>
        </section>

        {/* History Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-800">Our History</h2>
          <p className="text-gray-700 leading-relaxed">
            Founded with the vision of supporting tobacco farmers, TAMA Farmers
            Trust has grown from a small local initiative to a comprehensive
            organization serving the entire tobacco farming community. Our
            journey has been marked by continuous learning, adaptation, and
            commitment to our core values.
          </p>
        </section>

        {/* Team Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-800">Our Team</h2>
          <p className="text-gray-700 leading-relaxed">
            Our dedicated team consists of agricultural experts, industry
            professionals, and community leaders who are passionate about
            supporting tobacco farmers and advancing the industry. Together, we
            work towards creating a sustainable and prosperous future for all
            stakeholders.
          </p>
        </section>
      </div>
    </div>
  )
}

export default WhoWeArePage
