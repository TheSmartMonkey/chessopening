import { Component, OnInit } from '@angular/core';
import { ChessBoard } from "@chrisoakman/chessboardjs"

@Component({
  selector: 'app-analyse-board',
  templateUrl: './analyse-board.component.html',
  styleUrls: ['./analyse-board.component.scss']
})
export class AnalyseBoardComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    const board = Chessboard('board', 'start')
  }

}
