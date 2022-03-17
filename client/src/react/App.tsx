import React, { Component } from 'react'
import './App.scss'
import io from '../socket'
import { Picker } from './Picker'
import { CheckIcon, CheckState } from './CheckIcon'
import { Score } from './Score'

interface State {
  picks?: number[][]
  sex?: string
  choices: number[]
  guesses?: number[]
  curIdx: number,
  state: string,
  spouseData?: {
    picks: number[][],
    choices: number[]
  }
  animationPlaying: boolean,
  success: (CheckState | null)[]
  spouseScore?: number
  score?: number
}

class App extends Component<{}, State> {
  constructor (props: {}) {
    super(props)
    this.state = {
      choices: [],
      curIdx: 0,
      state: 'lobby',
      animationPlaying: false,
      success: []
    }
  }

  componentDidMount () {
    io.emit(this.state.sex)
    io.on('picks', picks => {
      this.setState({
        picks,
        state: 'judge',
        spouseScore: null,
        spouseData: null,
        curIdx: 0,
        choices: []
      })
    })
    io.on('spouseData', spouseData => this.setState({ spouseData }))
    io.on('spouseScore', spouseScore => this.setState({ spouseScore }))
  }

  handleGuess (idx) {
    const pick = this.state.spouseData.picks[this.state.curIdx]
    const truth = this.state.spouseData.choices[this.state.curIdx]
    const successState = getCheckState(truth, idx)
    const successArray = new Array(pick.length).fill(null)
    successArray[idx] = successState

    const nextGuesses = [...this.state.guesses, idx]

    const fullSuccess = pick.map((num, idx) => getCheckState(truth, idx))
    if (truth !== -1) {
      this.setState({
        animationPlaying: true,
        success: successArray,
        guesses: nextGuesses
      })
      setTimeout(() => {
        this.setState({
          success: fullSuccess
        })
        setTimeout(() => {
          this.startNextGuess()
        }, 1900)
      }, 800)
    } else {
      this.setState({
        animationPlaying: true,
        success: fullSuccess,
        guesses: nextGuesses
      })
      setTimeout(() => {
        this.startNextGuess()
      }, 1900)
    }
  }

  startNextGuess () {
    if (this.state.curIdx + 1 < this.state.spouseData.picks.length) {
      this.setState({
        success: [],
        animationPlaying: false,
        curIdx: this.state.curIdx + 1
      })
    } else {
      const score = this.getScore()
      this.setState({
        animationPlaying: false,
        state: 'scoreboard',
        score
      })

      io.emit('spouseScore', score)
    }
  }

  handlePick (idx) {
    const nextIdx = this.state.curIdx + 1
    const nextChoices = [...this.state.choices, idx]

    if (nextIdx === this.state.picks.length) {
      this.setState({
        choices: nextChoices,
        state: 'guess',
        animationPlaying: false,
        success: [],
        curIdx: 0,
        guesses: []
      })
      io.emit('spouseData', {
        choices: nextChoices,
        picks: this.state.picks
      })
    } else {
      this.setState({
        choices: nextChoices,
        curIdx: nextIdx
      })
    }
  }

  getScore ():number {
    return this.state.spouseData.choices.reduce((acc, truth, idx) => {
      const guess = this.state.guesses[idx]
      if (getCheckState(truth, guess) === 'false') {
        return acc
      }
      return acc + 1
    }, 0)
  }

  render () {
    const { state, sex: selectedSex, curIdx, picks, spouseData, animationPlaying, success, spouseScore, score, guesses } = this.state
    const myType = selectedSex === 'boy' ? 'waifu' : 'husbando'
    const spouseType = selectedSex === 'boy' ? 'husbando' : 'waifu'
    return (
      <div className='App'>
        <header className='App-header'>
          <h1 className='App-header-title'>Waifu ~ Husbando</h1>
        </header>
        <div className='App-content'>
          {state === 'lobby' && ['girl', 'boy'].map((sex, i) => (
            <button
              key={i}
              className='sex-button'
              disabled={selectedSex === sex}
              onClick={() => {
                this.setState({ sex })
                io.emit(sex)
              }}
            >
              {sex === 'girl' ? '♀' : '♂'}
            </button>
          ))}

          {state === 'judge' && picks != null && (
            <Picker
              pick={picks[curIdx]}
              onPick={(i) => this.handlePick(i)}
              type={myType}
              curIdx={curIdx}
              neither
              total={picks.length}
            />
          )}

          {state === 'guess' && (spouseData == null ? (
            <div>Waiting...</div>
          ) : (
            <Picker
              pick={spouseData.picks[curIdx]}
              onPick={(i) => this.handleGuess(i)}
              type={spouseType}
              curIdx={curIdx}
              total={spouseData.picks.length}
              pickLabel='SELECT'
              disabled={animationPlaying}
              success={success}
            />
          ))}

          {state === 'scoreboard' && (
            <>
              <Score sex={selectedSex} points={score} max={spouseData.picks.length} />

              {spouseScore != null && (
                <Score sex={selectedSex === 'boy' ? 'girl' : 'boy'} points={spouseScore} max={picks.length} />
              )}

              <div className='recap'>
                {spouseData.picks
                  .map((pick, i) => (
                    <div key={i} className='recap-line'>
                      <div className='recap-check'>
                        <CheckIcon
                          small
                          state={getCheckState(spouseData.choices[i], guesses[i])}
                        />
                      </div>
                      <div
                        className='recap-pic-wrapper'
                      >
                        {spouseData.choices[i] !== -1 ? (
                          <div
                            className='recap-pic'
                            style={{ backgroundImage: `url(img?type=${spouseType}&id=${pick[spouseData.choices[i]]})` }}
                          />
                        ) : (
                          <div
                            className='recap-no-pic'
                          />
                        )}

                      </div>
                      <div className='recap-rejected-wrapper'>
                        {pick
                          .filter(id => id !== pick[spouseData.choices[i]])
                          .map(id => (
                            <div
                              key={id}
                              className='recap-rejected'
                            >
                              <div
                                className='recap-pic'
                                style={{ backgroundImage: `url(img?type=${spouseType}&id=${id})` }}
                              />
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}
              </div>
            </>
          )}

        </div>
      </div>
    )
  }
}

function getCheckState (truth: number, guess: number): CheckState {
  return truth === guess ? 'true' : truth === -1 ? 'n/a' : 'false'
}

export default App
