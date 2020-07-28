import React, { useRef, useState, useEffect, RefObject, forwardRef, useCallback, useImperativeHandle } from 'react';

import './audio.scss';
import { AudioRef, AudioProps } from '../types';

function Audio(props: AudioProps, ref: RefObject<AudioRef> | any): JSX.Element {
  const audio: RefObject<HTMLAudioElement> = useRef(null);

  const _formatDate = useCallback((time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);

    return `${`${minutes}`.padStart(2, '0')}:${`${seconds}`.padStart(2, '0')}`;
  }, []);

  const [isPause, setPause] = useState(true);
  const [loading, setLoading] = useState<boolean>(true);

  const [duration, setDuration] = useState('00:00');
  const [loaded, setLoaded] = useState(0);
  const _onProgress = useCallback((e: Event) => {
    const el = e.currentTarget as HTMLAudioElement;
    const { buffered, duration } = el;
    const progress = (((buffered.end(buffered.length - 1) * 100) / duration) * 100) / 100;

    setLoaded(progress);
  }, []);

  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState('00:00');
  const _onTimeupdate = useCallback(
    (e) => {
      const el = e.currentTarget as HTMLAudioElement;
      const { currentTime, duration, ended } = el;
      const progress = Math.floor((currentTime / duration) * 10000) / 100;

      if (ended) {
        setPause(true);
      }

      setProgress(progress);
      setCurrentTime(_formatDate(currentTime));
    },
    [_formatDate]
  );

  const _onCanplay = useCallback(
    (e) => {
      const el = e.currentTarget as HTMLAudioElement;
      const { duration } = el;

      setLoading(false);
      setDuration(_formatDate(duration));
    },
    [_formatDate]
  );

  const _onWaiting = useCallback(() => {
    setLoading(true);
  }, []);

  useEffect(() => {
    const { current } = audio;

    current?.addEventListener('progress', _onProgress);
    current?.addEventListener('timeupdate', _onTimeupdate);
    current?.addEventListener('waiting', _onWaiting);
    current?.addEventListener('canplay', _onCanplay);

    return () => {
      current?.removeEventListener('progress', _onProgress);
      current?.removeEventListener('timeupdate', _onTimeupdate);
      current?.removeEventListener('timeupdate', _onWaiting);
      current?.removeEventListener('timeupdate', _onCanplay);
    };
  }, [_onCanplay, _onProgress, _onTimeupdate, _onWaiting]);

  const onPlay = useCallback(() => {
    audio?.current?.play();
    setPause(false);
  }, []);

  const onPause = useCallback(() => {
    audio?.current?.pause();
    setPause(true);
  }, []);

  const onForward = useCallback(() => {
    if (audio?.current?.currentTime) {
      audio.current.currentTime += 15;
    }
  }, []);

  const onBack = useCallback(() => {
    if (audio?.current?.currentTime) {
      audio.current.currentTime -= 15;
    }
  }, []);

  useImperativeHandle(ref, () => ({
    onPlay,
    onPause,
  }));

  return (
    <div className="simon-audio-container">
      <audio ref={audio} src={props.src} preload="true"></audio>
      <div className="simon-audio-schedule-btn simon-audio-schedule-btn--back" onClick={onBack}></div>
      <div className="simon-audio-btn-box">
        {loading ? (
          <div className="simon-audio-loading">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
        ) : isPause ? (
          <div className="simon-audio-play-btn" onClick={onPlay}></div>
        ) : (
          <div className="simon-audio-pause-btn" onClick={onPause}></div>
        )}
      </div>
      <div className="simon-audio-main">
        <div className="simon-audio-main__loaded" style={{ width: `${loaded}%` }}></div>
        <div className="simon-audio-main__el" style={{ width: `${progress}%` }}></div>
      </div>
      <div className="simon-audio-content">
        {currentTime} / {duration}
      </div>
      <div className="simon-audio-schedule-btn simon-audio-schedule-btn--forward" onClick={onForward}></div>
    </div>
  );
}

export default forwardRef(Audio);
