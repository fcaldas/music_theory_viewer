import { Component, OnInit, Input } from '@angular/core';
import { Note, NoteName, getTriadName} from './../../classes/music/note';
import * as Tone from 'tone';

@Component({
  selector: 'app-chords-in-scale',
  templateUrl: './chords-in-scale.component.html',
  styleUrls: ['./chords-in-scale.component.css']
})
export class ChordsInScaleComponent implements OnInit {

  @Input()
  selected_notes: Note[];
  synth: Tone.PolySynth;

  constructor() { }

  ngOnInit() {
    this.synth = new Tone.PolySynth(

    ).toDestination();
    this.synth.set({
      envelope:{
        attack: .015,
        sustain: .1,
      }
    })

  }

  get_triad(degree:number, note:Note): Note[]{
    let triad = [note];
    let sec_degree = degree + 2;
    let third_degree = degree + 4;
    if(sec_degree < this.selected_notes.length){
      triad.push(this.selected_notes[sec_degree]);
    }else{
      sec_degree -= this.selected_notes.length - 1;
      triad.push(new Note(
        this.selected_notes[sec_degree].note,
        this.selected_notes[sec_degree].degree+1)
      );
    }

    if(third_degree < this.selected_notes.length){
      triad.push(this.selected_notes[third_degree]);
    }else{
      third_degree -= this.selected_notes.length - 1;
      triad.push(new Note(
        this.selected_notes[third_degree].note,
        this.selected_notes[third_degree].degree+1)
      );
    }
    return triad;
  }

  get_triad_name(degree:number, note:Note): string{
    let triad = this.get_triad(degree, note);
    if(triad.length == 3){
      return getTriadName(triad);
    }else{
      return "invalid"; 
    }
  }

  play_triad(degree: number, note: Note){
    let triad = this.get_triad(degree, note);
    let now = Tone.now();
    let k = 0;
    for(let n of triad){
      this.synth.triggerAttackRelease(n.toString(), "8n", now + .1 * k);
      k += 1;
      this.synth.triggerAttackRelease(n.toString(), "8n", now + 1);
    }
  }
}
