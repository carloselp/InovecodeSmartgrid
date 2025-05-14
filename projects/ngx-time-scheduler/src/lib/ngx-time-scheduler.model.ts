import { MatMenuTrigger } from '@angular/material/menu';
import * as moment from 'moment';

export class Period {
  name!: string;
  classes!: string;
  timeFramePeriod!: number;
  timeFrameOverall!: number;
  timeFrameHeaders!: string[];
  timeFrameHeadersTooltip?: string[];
  tooltip?: string;
}

export class Item {
  id!: number;
  name!: string;
  start!: moment.Moment;
  end!: moment.Moment;
  classes!: string;
  sectionID!: number;
  tooltip?: string;
  metadata?: any;
}

export class Travel {
  id!: number;
  name!: string;
  start!: moment.Moment;
  end!: moment.Moment;
  classes!: string;
  sectionID!: number;
  tooltip?: string;
  metadata?: any;
  arrival?: string;
  departure?: string;
  driver?: string;
  gps?: number;
}

export class Section {
  id!: number;
  name!: string;
  tooltip?: string;
  status?: string;
  enterprise?: string;
}

export class Text {
  NextButton: string;
  PrevButton: string;
  TodayButton: string;
  GotoButton: string;
  SectionTitle: string;
  HeaderTitle: string;

  constructor() {
    this.NextButton = 'Avançar';
    this.PrevButton = 'Voltar';
    this.TodayButton = 'Hoje';
    this.GotoButton = 'Ir para';
    this.SectionTitle = '';
    this.HeaderTitle = '';
  }
}

export class Travels {
  // TravelResized: (item: Travel, start: any, end: any) => void;
  // TravelMovement: (item: Travel, start: any, end: any) => void;
  // TravelMovementStart: (item: Travel, start: any, end: any) => void;
  // TravelMovementEnd: (item: Travel, start: any, end: any) => void;
  TravelAddIconFromSection!: (item: Section) => void;
  TravelFilterFromData!: (item: string) => void;
  TravelDropped!: (item: any) => void;
  TravelClicked!:(event: MouseEvent, item: Travel, menuTrigger: MatMenuTrigger) => void;
  TravelClickedMap!:(event: MouseEvent, item: Travel, menuTrigger: MatMenuTrigger) => void;
  VehicleClicked!:(travel: Travel, vehicle: Section) => void;
  TravelContextMenu!: ((item: any, event: MouseEvent, menuTrigger: MatMenuTrigger) => void);
  SectionClickTravel!: (section: Section) => void;
  SectionContextMenuTravel!: (section: any, event: MouseEvent) => void;
  PeriodChange!: (start: moment.Moment, end: moment.Moment) => void;
}

export class SectionTravel {
  section!: Section;
  minRowHeight!: number;
  itemMetas: TravelMeta[];

  constructor() {
    this.itemMetas = new Array<TravelMeta>();
  }
}

export class TravelMeta {
  item!: Travel;
  isStart!: boolean;
  sectionID!: number;
  isEnd!: boolean;
  cssTop: number;
  cssLeft: number;
  cssWidth: number;

  constructor() {
    this.cssTop = 0;
    this.cssLeft = 0;
    this.cssWidth = 0;
  }
}

export class Header {
  headerDetails: HeaderDetails[];

  constructor() {
    this.headerDetails = new Array<HeaderDetails>();
  }
}

export class HeaderDetails {
  name!: string;
  colspan!: number;
  tooltip?: string;
}
