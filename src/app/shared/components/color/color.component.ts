import { Component, Input, OnInit } from '@angular/core';
import { ColorService } from 'src/app/core/services/color.service';
import { Color } from 'src/app/models/shared';

@Component({
  selector: 'app-color',
  templateUrl: './color.component.html',
  styleUrls: ['./color.component.scss'],
})
export class ColorComponent implements OnInit {
  @Input() colorId: number;
  @Input() onlyMainColor = false;
  @Input() colorName = '';

  color: Color;

  constructor(private readonly colorService: ColorService) {}

  async ngOnInit(): Promise<void> {
    this.color = await this.colorService.getColor(this.colorId);
  }
}
