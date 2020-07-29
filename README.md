# react-custom-audio

## Install

```bash
npm install react-custom-audio
```

```bash
yarn add react-custom-audio
```

## Usage

```jsx
import Audio from 'react-custom-audio';

<Audio src="audio.mp3" key="audio.mp3" />;
```

And import style manually:

```jsx
import 'react-custom-audio/main.css';
```

## API

| Params | Desc                                                       | Types  |
| ------ | ---------------------------------------------------------- | ------ |
| key    | The unique identifier corresponding to the playback source | String |
| src    | Playback source                                            | String |
| ref    | Audio instance is bound to onPlay and onPause events       | Ref    |
