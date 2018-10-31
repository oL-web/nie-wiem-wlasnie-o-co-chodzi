import React from 'react';
import { render } from 'react-dom';
import { Howl } from "howler";
import { createGlobalStyle } from 'styled-components';
import styled from "styled-components";
import shuffle from "lodash/shuffle";

import Btn from '@material-ui/core/Button';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import nie from "../sounds/nie.mp3";
import wiem from "../sounds/wiem.mp3";
import wlasnie from "../sounds/wlasnie.mp3";
import o_co from "../sounds/o co.mp3";
import chodzi from "../sounds/chodzi.mp3";

const GlobalStyle = createGlobalStyle`
  html {
    background-color: #efefef;
  }
  body{
      margin:0;
  }
  #app{
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }
`;
const Button = styled(Btn)`
  margin:5px !important;
`;
const ButtonGroup = styled.div`
  display:flex;
  align-items:center;
  justify-content:center;
  flex-wrap:wrap;
  padding-top:20px;
`;
const Footer = styled.footer`
    padding: 20px;
    margin: 0 auto;
    margin-top: auto;
`;
const Subtitle = styled(Typography)`
    text-align:center;
`;

const sounds = [
    { name: "nie", sound: new Howl({ src: nie }) },
    { name: "wiem", sound: new Howl({ src: wiem }) },
    { name: "właśnie", sound: new Howl({ src: wlasnie }) },
    { name: "o co", sound: new Howl({ src: o_co }) },
    { name: "chodzi", sound: new Howl({ src: chodzi }) }
];

class App extends React.Component {
    state = {
        soundQueue: [],
        soundSubtitle: ""
    };
    clickHandler = (index) => () => {
        this.setState(prevState => ({
            soundQueue: prevState.soundQueue.concat(index)
        }));
    };
    playSelectedSounds = () => {
        const { soundQueue } = this.state;
        if (soundQueue.length) this.playSoundQueue(soundQueue);
    };
    playRandomizedSounds = () => {
        const soundQueue = shuffle(
            Array.from({ length: sounds.length }, (v, k) => k)
        );
        this.playSoundQueue(soundQueue);
    };
    playSoundQueue = (soundQueue) => {
        const firstSoundIndex = soundQueue[0];
        let soundSubtitle = "";

        soundQueue.forEach((soundIndex, i) => {
            const soundObj = sounds[soundIndex];
            const nextSoundIndex = soundQueue[i + 1];
            soundSubtitle += `${soundObj.name} `;

            if (nextSoundIndex !== undefined) {
                const nextSoundInQueue = sounds[nextSoundIndex].sound;

                soundObj.sound.once("end", () => {
                    nextSoundInQueue.play();
                });
            }
        });

        sounds[firstSoundIndex].sound.play();
        this.setState({ soundQueue: [], soundSubtitle });
    };
    render() {
        const { soundSubtitle, soundQueue } = this.state;

        return (
            <React.Fragment>
                <AppBar position="static" color="primary">
                    <Toolbar>
                        <Typography variant="h6" color="inherit">
                            nie wiem właśnie o co chodzi
                        </Typography>
                    </Toolbar>
                </AppBar>

                <ButtonGroup>
                    {
                        sounds.map((sound, i) => (
                            <Button
                                variant="outlined"
                                color="primary"
                                key={i}
                                disabled={soundQueue.includes(i)}
                                onClick={this.clickHandler(i)}
                            >
                                {sound.name}
                            </Button>
                        ))
                    }
                </ButtonGroup>

                <ButtonGroup>
                    <Button variant="contained" color="primary" onClick={this.playSelectedSounds}>
                        Odtwórz zaznaczone
                     </Button>
                    <Button variant="contained" color="primary" onClick={this.playRandomizedSounds}>
                        Odtwórz losowe
                    </Button>
                </ButtonGroup>

                {soundSubtitle &&
                    <Subtitle variant="body2">
                        {soundSubtitle}
                    </Subtitle>
                }

                <Footer>
                    <Typography variant="body1">
                        Autor strony:&nbsp;
                        <a href="https://github.com/oL-web">Michał Olejniczak</a>
                    </Typography>
                </Footer>
                <GlobalStyle />
            </React.Fragment>
        );
    }
}

render(<App />, document.getElementById("app"));