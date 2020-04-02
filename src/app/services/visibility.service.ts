import {ElementRef, Inject, Injectable} from "@angular/core";
import {combineLatest, concat, defer, fromEvent, Observable, of} from "rxjs";
import {distinctUntilChanged, flatMap, switchMap, tap} from "rxjs/operators";
import {DOCUMENT} from "@angular/common";

@Injectable()
export class VisibilityService {

    private pageVisible$: Observable<boolean>;

    constructor(@Inject(DOCUMENT) document: any) {
        this.pageVisible$ = concat(
            defer(() => of(!document.hidden)),
            fromEvent(document, 'visibilitychange')
                .pipe(
                    switchMap(e => of(!document.hidden))
                )
        );
    }

    elementInSight(element: ElementRef):Observable<boolean> {

        const elementVisible$ = Observable.create(observer => {
            const intersectionObserver = new IntersectionObserver(entries => {
                observer.next(entries);
            });

            intersectionObserver.observe(element.nativeElement);

            return () => { intersectionObserver.disconnect(); };

        })
            .pipe (
                flatMap((entries:any) => entries),
                switchMap((entry:any) => of(entry.isIntersecting)),
                distinctUntilChanged()
            );

        const elementInSight$ = combineLatest(
            this.pageVisible$,
            elementVisible$,
            (pageVisible, elementVisible) => pageVisible && elementVisible
        )
            .pipe (
                distinctUntilChanged()
            );

        return elementInSight$;
    }

}