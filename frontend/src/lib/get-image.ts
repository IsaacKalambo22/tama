import { getPlaiceholder } from 'plaiceholder';

export async function getImage(src: string) {
  const controller = new AbortController();
  const timeout = setTimeout(
    () => controller.abort(),
    90000
  ); // 30 seconds timeout

  const response = await fetch(src, {
    signal: controller.signal,
  });
  const buffer = Buffer.from(
    await response.arrayBuffer()
  );

  clearTimeout(timeout);

  const {
    metadata: { height, width },
    ...plaiceholder
  } = await getPlaiceholder(buffer, { size: 10 });

  return {
    ...plaiceholder,
    img: { src, height, width },
  };
}
