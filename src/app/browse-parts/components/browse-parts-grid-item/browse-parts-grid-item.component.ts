import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { interval } from 'rxjs';
import { BrowsePartsPart } from 'src/app/models/browse-parts';

@Component({
  selector: 'app-browse-parts-grid-item',
  templateUrl: './browse-parts-grid-item.component.html',
  styleUrls: ['./browse-parts-grid-item.component.scss'],
})
export class BrowsePartsGridItemComponent implements OnInit, AfterViewInit {
  ready = false;

  @Input()
  part: BrowsePartsPart;

  @Input()
  index: number;

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.ready = true;

    const el = document.getElementById(String(this.part.elementId));
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        // el is visible
        // console.log(this.index, 'visible');
        interval(this.index).subscribe(e => (this.ready = true));

        observer.disconnect();
      } else {
        this.ready = false;
        // el is not visible
      }
    });

    // observer.observe(el); // Asynchronous call
    //interval(1 * this.index).subscribe(e => (this.ready = true));
  }

  onLoad() {
    // console.log(this.index);
    this.ready = true;
  }

  getImageStyle(part: BrowsePartsPart) {
    // return `background-image: url('https://brickhunter.blob.core.windows.net${part.imageUrl}'),
    //         url('placeholder.jpg');
    //         width: 100%;
    //         height: 120px;
    //         background-repeat: no-repeat;
    //         background-size: contain;
    //         background-position: center;`;

    return `width: 100%;
            height: 120px;
            background-repeat: no-repeat;
            background-size: contain;
            background-position: center;`;
  }

  isInViewport(element) {
    console.log(element);
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }
}
