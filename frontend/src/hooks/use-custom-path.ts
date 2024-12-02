const useCustomPath = (path: string) => {
  // Split the path by '/admin'
  const [path1, ...rest] = path.split('/admin');

  // Path 1: The full path (including '/admin')
  const fullPath =
    path1 +
    (rest.length
      ? '/admin' + rest.join('/')
      : '');

  // Path 2: The path without '/admin'
  const pathWithoutAdmin = rest.join('/');

  return { fullPath, pathWithoutAdmin };
};

export default useCustomPath;
