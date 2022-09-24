import { Component, OnInit } from '@angular/core';
import {QuestionService} from "../../../service/question-service";
import {QuestionPayloadResponseModel} from "../../../model/question-payload-response-model";
import {MatDialog} from "@angular/material/dialog";
import {ConfirmDeletionDialogComponent} from "./confirm-deletion-dialog/confirm-deletion-dialog.component";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-questions-list',
  templateUrl: './questions-list.component.html',
  styleUrls: ['./questions-list.component.css']
})
export class QuestionsListComponent implements OnInit {
  questions : QuestionPayloadResponseModel[] = [];
  perPage : number[] = [1, 2, 3, 5, 10];
  totalElements : number = 0;
  totalPages : number = 0;
  pageSize : number = 5;
  pageNumber : number = 1;
  keyword : string = '';
  public displayedColumns : string[] = ['content', 'subjectName', 'update', 'delete']
  constructor(private questionService : QuestionService,
              private dialogRef : MatDialog,
              private activatedRoute : ActivatedRoute,
              private router : Router) { }

  ngOnInit(): void {
    this.loadData();
  }

   handleResponse(data : any) {
    this.questions = data.content;
    this.totalElements = data.totalElements;
    this.totalPages = data.totalPages;
    this.pageNumber = data.number + 1;
    this.pageSize = data.size;
  }

  public loadData() {
    this.activatedRoute.queryParamMap
      .subscribe((queryParamMap) => {
        if (queryParamMap.has('keyword')) {
           this.questionService.getQuestionsByKeywordWithPagination(this.pageNumber - 1, this.pageSize, this.keyword)
             .subscribe((res) => this.handleResponse(res));
        } else {
          this.questionService.getQuestionsWithPagination(this.pageNumber - 1, this.pageSize)
            .subscribe((res) => this.handleResponse(res));
        }
      })
  }

  onDeleting(questionId : number) {
    this.dialogRef.open(ConfirmDeletionDialogComponent, {
      data : {
        questionId
      }
    })
  };

  changePerPage(perPage : number) {
    this.pageSize = perPage;
    this.loadData();
  }

  searchForQuestionsByKeyword() {
    this.router.navigate([], {
      queryParams : {
        keyword : this.keyword
      }
    })
  }

}
