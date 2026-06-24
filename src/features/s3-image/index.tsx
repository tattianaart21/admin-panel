import { useS3Loader } from "@/entities/s3-loader";

export function S3Image(props: { filePath: string }) {
  const { data } = useS3Loader(props.filePath);

  return <img src={data} />;
}
