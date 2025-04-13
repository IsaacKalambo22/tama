const useCustomPath = (
  path: string
): {
  fullPath: string;
  pathWithoutAdmin: string;
} => {
  // Split the path by '/admin'
  const [path1, ...rest] = path.split('/admin');

  // Path 1: The full path (including '/admin')
  const fullPath =
    path1 +
    (rest.length > 0
      ? '/admin' + rest.join('/')
      : '');

  // Path 2: The path without '/admin'
  const pathWithoutAdmin =
    rest.length > 0 ? rest.join('/') : path;

  return { fullPath, pathWithoutAdmin };
};

export default useCustomPath;
