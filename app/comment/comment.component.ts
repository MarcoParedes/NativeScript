import { Component, OnInit } from '@angular/core';
import { ModalDialogParams } from 'nativescript-angular/modal-dialog';
import { Validators, FormBuilder, FormGroup} from '@angular/forms';
import { Slider } from "tns-core-modules/ui/slider";
import { TextField } from 'ui/text-field';
import { Comment } from '../shared/comment';

@Component({
    moduleId: module.id,
    templateUrl: './comment.component.html'
})

export class CommentComponent implements OnInit {
    
    formComment: FormGroup;
    comment: Comment;

    constructor(private params: ModalDialogParams,
        private formBuilder: FormBuilder) {
            
            this.formComment = this.formBuilder.group({
                author: ['', Validators.required],
                rating: 5,
                comment: ['', Validators.required]
            });
    }

    ngOnInit(){
    }
    
    onRatingChange(args){
        let slider = <Slider>args.object;
        
        this.formComment.patchValue({ rating: slider.value });
    }

    onNameChange(args) {
        let textField = <TextField>args.object;

        this.formComment.patchValue({ author: textField.text});
    }

    onCommentChange(args) {
        let textField = <TextField>args.object;

        this.formComment.patchValue({ comment: textField.text});
    }

    onSubmit() {
        let date = new Date();
        this.comment = this.formComment.value;
        this.comment.date = date.toDateString();
        this.params.closeCallback(this.comment);
    }

}