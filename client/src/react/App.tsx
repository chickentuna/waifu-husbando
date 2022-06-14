import React, { Component } from 'react'
import io from '../socket'
import './App.scss'
import { CheckIcon, CheckState } from './CheckIcon'
import RadioList from './components/list/RadioList'
import { Picker } from './Picker'
import { Score } from './Score'
import SexPicker from './SexPicker'
import { Type } from './types'

export function sexToType (sex:string): Type {
  return sex === 'boy' ? 'waifu' : 'husbando'
}

interface State {
  solo: boolean
  picks?: string[][]
  sex?: string
  choices: number[]
  guesses?: number[]
  curIdx: number,
  state: string,
  spouseData?: {
    picks: string[][],
    choices: number[],
    folder: string
  }
  animationPlaying: boolean,
  success: (CheckState | null)[]
  spouseScore?: number
  score?: number
  folders?: Record<Type, string[]>
  selectedFolder?: string
  ready: boolean
}

class App extends Component<{solo?: boolean}, State> {
  constructor (props: {solo?: boolean}) {
    super(props)
    this.state = {
      choices: [],
      curIdx: 0,
      state: 'lobby',
      animationPlaying: false,
      success: [],
      ready: false,
      sex: localStorage.getItem('sex'),
      solo: props.solo ?? false
    }
  }

  preload (urls: string[]) {
    urls.forEach(url => {
      const img = new Image()
      img.src = url
    })
  }

  componentDidMount () {
    io.on('picks', picks => {
      this.preload(picks.flat())
      this.setState({
        picks,
        state: 'judge',
        spouseScore: null,
        spouseData: null,
        curIdx: 0,
        choices: []
      })
    })
    io.on('spouseData', spouseData => {
      this.preload(spouseData.picks.flat())
      this.setState({ spouseData })
    })
    io.on('spouseScore', spouseScore => this.setState({ spouseScore }))
    io.emit('folders', false)
    io.once('folders', (folders: { waifu: string[], husbando: string[] }) => this.setState({ folders }))
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
        picks: this.state.picks,
        folder: this.state.selectedFolder
      })
    } else {
      this.setState({
        choices: nextChoices,
        curIdx: nextIdx
      })
    }
  }

  getScore (): number {
    return this.state.spouseData.choices.reduce((acc, truth, idx) => {
      const guess = this.state.guesses[idx]
      if (getCheckState(truth, guess) === 'false') {
        return acc
      }
      return acc + 1
    }, 0)
  }

  handleFolderChange (e: React.ChangeEvent<HTMLInputElement>) {
    const newSelectedFolder = e.target.value
    this.setState({
      selectedFolder: newSelectedFolder
    })
    localStorage.setItem('selectedFolder', newSelectedFolder)
  }

  render () {
    const { state, sex: selectedSex, curIdx, picks, spouseData, animationPlaying, success, spouseScore, score, guesses, selectedFolder } = this.state
    const myType = selectedSex === 'boy' ? 'waifu' : 'husbando'
    const spouseType = selectedSex === 'boy' ? 'husbando' : 'waifu'

    return (
      <div className='App'>
        <header className='App-header'>
          {this.state.solo
            ? <h1 className='App-header-title'>Waifu ~ Husbando (solo)</h1>
            : <h1 className='App-header-title'>Waifu ~ Husbando</h1>}
        </header>
        <div className='App-content'>
          {state === 'lobby' && (
            <>
              <SexPicker
                onClick={(sex:string) => {
                  localStorage.setItem('sex', sex)
                  this.setState({ sex })
                }}
                selected={selectedSex}
                disabled={this.state.ready}
              />

              <div className='radio-options'>
                {selectedSex != null && this.state.folders != null && (
                  <RadioList
                    options={
                      this.state.folders[myType]
                      .filter(folderName => this.state.solo || !folderName.startsWith('_'))
                      .map(folderName => ({
                        label: folderName,
                        value: folderName
                      }))
                    }
                    onChange={(e) => this.handleFolderChange(e)}
                    disabled={this.state.ready}
                    isChecked={(option) => this.state.selectedFolder === option.label}
                  />
                )}

              </div>

              {selectedSex != null && (
                <div>
                  <button
                    className='audit-button'
                    onClick={() => {
                      this.setState({ ready: true })
                      io.emit(selectedSex, { folder: this.state.selectedFolder, solo: this.state.solo })
                    }}
                    disabled={this.state.ready || !this.state.folders?.[myType].includes(this.state.selectedFolder)}
                  >
                  READY
                  </button>
                </div>
              )}
            </>
          )}

          {state === 'judge' && picks != null && (
            <Picker
              pick={picks[curIdx]}
              onPick={(i) => this.handlePick(i)}
              type={myType}
              curIdx={curIdx}
              neither
              total={picks.length}
              folder={selectedFolder}
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
              folder={spouseData.folder}
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
                            style={{ backgroundImage: `url(${pick[spouseData.choices[i]]})` }}
                          />
                        ) : (
                          <div
                            className='recap-no-pic'
                          />
                        )}

                      </div>
                      <div className='recap-rejected-wrapper'>
                        {pick
                          .filter(url => url !== pick[spouseData.choices[i]])
                          .map(url => (
                            <div
                              key={url}
                              className='recap-rejected'
                            >
                              <div
                                className='recap-pic'
                                style={{ backgroundImage: `url(${url})` }}
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
