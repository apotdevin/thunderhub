import { useEffect, useState } from 'react';

export const useFileReader = () => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<any>(null);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!file) return;
    const reader = new FileReader();

    reader.onloadstart = () => {
      setLoading(true);
    };

    reader.onloadend = () => {
      setLoading(false);
    };

    reader.onload = e => {
      if (e?.target?.result) {
        setData(e.target.result);
      }
    };
    reader.onerror = e => {
      if (e) {
        setError(e);
      }
    };

    reader.readAsText(file);
  }, [file]);

  return [setFile, { data, error, file, loading }] as const;
};
