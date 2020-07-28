export interface AudioRef {
  onPlay: () => void;
  onPause: () => void;
}

export interface AudioProps {
  key: string;
  src: string;
}
