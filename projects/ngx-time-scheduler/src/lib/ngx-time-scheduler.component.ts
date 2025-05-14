import { ChangeDetectorRef, Component, ElementRef, HostListener, Input, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { NgxTimeSchedulerService } from './ngx-time-scheduler.service';
import {
  HeaderDetails,
  Header,
  TravelMeta,
  Travel,
  Period,
  SectionTravel,
  Section,
  Text,
  Travels
} from './ngx-time-scheduler.model';
import * as moment_ from 'moment';
import { Subscription } from 'rxjs';

const moment = moment_;
import 'moment/locale/pt-br';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { Router } from '@angular/router';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { DriverService } from 'src/app/service/travel/driver.service';
import { ToastrService } from 'ngx-toastr';
import { TravelService } from 'src/app/service/travel/travel.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
standalone: false,
  
  selector: 'ngx-ts[items][periods][sections]',
  templateUrl: './ngx-time-scheduler.component.html',
  styleUrls: ['./ngx-time-scheduler.component.css']
})
export class NgxTimeSchedulerComponent implements OnInit, OnDestroy {
  nativeElement: NgxTimeSchedulerComponent | undefined;
  @ViewChild('sectionTd') set SectionTd(elementRef: ElementRef) {
    this.SectionLeftMeasure = elementRef.nativeElement.clientWidth + 'px';
    this.changeDetector.detectChanges();
  }

  @Input() currentTimeFormat = 'DD-MMM-YYYY HH:mm';
  @Input() showCurrentTime = true;
  @Input() showHeaderTitle = true;
  @Input() showActionButtons = true;
  @Input() showGoto = true;
  @Input() showToday = true;
  @Input() allowDragging = false;
  @Input() locale = 'pt-br';
  @Input() showBusinessDayOnly = false;
  @Input() headerFormat = 'Do MMM YYYY';
  @Input() minRowHeight = 30;
  @Input() maxHeight: string = "";
  @Input() text = new Text();
  @Input() items!: Travel[];
  @Input() sections!: Section[];
  @Input() periods!: Period[];
  @Input() events: Travels = new Travels();
  @Input() start = moment().startOf('day').utc();

  end = moment().endOf('day').utc();
  showGotoModal = false;
  currentTimeIndicatorPosition!: string;
  currentTimeVisibility = 'visible';
  currentTimeTitle!: string;
  ShowCurrentTimeHandle!: any;
  SectionLeftMeasure = '0';
  currentPeriod!: Period;
  currentPeriodMinuteDiff = 0;
  header!: Header[];
  sectionTravels!: SectionTravel[];
  itemsFiltereds!: SectionTravel[];
  subscription = new Subscription();
  isLargeScreen = true;
  selectedDate: Date = new Date();
  isFiltering: boolean = false;
  filteredSectionTravels: SectionTravel[] = [];
  isFullScreen = false;
  periodSelect!: any;
  drivers: any[] = [];
  showInfo: boolean = false;

  range: FormGroup;
  daysDifference: number | null = null;

  @ViewChild('schedulerContainer', { static: false }) schedulerContainer!: ElementRef;

  @ViewChild(MatMenuTrigger) secondMenuTrigger: MatMenuTrigger | undefined; // Acessando MatMenuTrigger, não MatMenu

  constructor(
    private changeDetector: ChangeDetectorRef,
    private service: NgxTimeSchedulerService,
    private fb: FormBuilder,
    private route: Router,
    private driverService: DriverService,
    private toastr: ToastrService,
    private travelService: TravelService,
    private spinner: NgxSpinnerService
  ) {
    moment.locale(this.locale);
    this.range = this.fb.group({
      start: ['', Validators.required],
      end: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.setSectionsInSectionTravels();
    this.changePeriod(this.periods[0], false);
    this.itemPush();
    this.itemPop();
    this.itemRemove();
    this.sectionPush();
    this.sectionPop();
    this.sectionRemove();
    this.refresh();
    this.checkScreenSize();
    this.getDrivers();

    document.addEventListener('fullscreenchange', this.onFullscreenChange);
    document.addEventListener('webkitfullscreenchange', this.onFullscreenChange);  // Para navegadores Webkit (Safari, Chrome)
    document.addEventListener('mozfullscreenchange', this.onFullscreenChange);  // Para Firefox
    document.addEventListener('msfullscreenchange', this.onFullscreenChange);  // Para IE/Edge
  }

  toggleFilter() {
    this.isFiltering = true;
  }

  resetFilter() {
    this.isFiltering = false;
    this.filteredSectionTravels = [...this.sectionTravels]; // Reseta o filtro
  }

  filterSectionTravels(event: Event) {
    const value = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredSectionTravels = this.sectionTravels.filter((sectionTravel) =>
      sectionTravel.section.name.toLowerCase().includes(value)
    );
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.checkScreenSize();
  }

  checkScreenSize() {
    this.isLargeScreen = window.innerWidth > 768;
  }

  refreshView() {
    this.setSectionsInSectionTravels();
    this.changePeriod(this.currentPeriod, false);
  }

  trackByFn(index: any, item: any) {
    return index;
  }

  setSectionsInSectionTravels() {
    this.sectionTravels = new Array<SectionTravel>();
    this.sections.forEach(section => {
      const perSectionTravel = new SectionTravel();
      perSectionTravel.section = section;
      perSectionTravel.minRowHeight = this.minRowHeight;
      this.sectionTravels.push(perSectionTravel);
      this.filteredSectionTravels = [...this.sectionTravels];
      this.itemsFiltereds = [...this.sectionTravels];
    });
  }

  getDrivers() {
    this.driverService.getAllDriver().subscribe(
      response => {
        this.drivers = response as any[];
      }
    )
  }

  setTravelsInSectionTravels() {
    const itemMetas = new Array<TravelMeta>();

    this.sectionTravels.forEach(ele => {
      ele.itemMetas = new Array<TravelMeta>();
      ele.minRowHeight = this.minRowHeight;

      this.items.filter(i => {
        let itemMeta = new TravelMeta();

        if (i.sectionID === ele.section.id) {
          itemMeta.item = i;
          if (itemMeta.item.start <= this.end && itemMeta.item.end >= this.start) {
            itemMeta = this.itemMetaCal(itemMeta);
            ele.itemMetas.push(itemMeta);
            itemMetas.push(itemMeta);
          }
        }
      });
    });

    const sortedTravels = itemMetas.reduce((sortTravels: any, itemMeta: TravelMeta) => {
      const index = this.sectionTravels.findIndex(sectionTravel => sectionTravel.section.id === itemMeta.item.sectionID);
      if (!sortTravels[index]) {
        sortTravels[index] = [];
      }
      sortTravels[index].push(itemMeta);
      return sortTravels;
    }, {});

    this.calCssTop(sortedTravels);
  }

  itemMetaCal(itemMeta: TravelMeta, minColumnWidth: number = 0) {
    // Ajustar horários para corrigir o deslocamento de 3 horas
    const correctedStart = moment(itemMeta.item.start).subtract(3, 'hours');
    const correctedEnd = moment(itemMeta.item.end).subtract(3, 'hours');

    // Encontrar o intervalo ajustado considerando os limites do calendário
    const foundStart = moment.max(correctedStart, this.start);
    const foundEnd = moment.min(correctedEnd, this.end);

    // Calcular diferenças em minutos
    let widthMinuteDiff = Math.abs(foundStart.diff(foundEnd, 'minutes'));
    let leftMinuteDiff = foundStart.diff(this.start, 'minutes');

    // Ajustar cálculo para dias úteis, se aplicável
    if (this.showBusinessDayOnly) {
      widthMinuteDiff -= (this.getNumberOfWeekendDays(moment(foundStart), moment(foundEnd)) * this.currentPeriod.timeFramePeriod);
      leftMinuteDiff -= (this.getNumberOfWeekendDays(moment(this.start), moment(foundStart)) * this.currentPeriod.timeFramePeriod);
    }

    // Calcular largura e posição horizontal em porcentagem
    const totalWidthPercent = (widthMinuteDiff / this.currentPeriodMinuteDiff) * 100;
    itemMeta.cssLeft = (leftMinuteDiff / this.currentPeriodMinuteDiff) * 100;

    // Garantir que a largura mínima seja respeitada
    itemMeta.cssWidth = Math.max(totalWidthPercent, minColumnWidth);

    // Configurar as flags de início e fim do item
    itemMeta.isStart = correctedStart >= this.start;
    itemMeta.isEnd = correctedEnd <= this.end;

    return itemMeta;
  }

  calCssTop(sortedTravels: any) {
    for (const prop of Object.keys(sortedTravels)) {
      for (let i = 0; i < sortedTravels[prop].length; i++) {
        let elemBottom;
        const elem = sortedTravels[prop][i];

        for (let prev = 0; prev < i; prev++) {
          const prevElem = sortedTravels[prop][prev];
          const prevElemBottom = prevElem.cssTop + this.minRowHeight;
          elemBottom = elem.cssTop + this.minRowHeight;

          if ((
            (prevElem.item.start <= elem.item.start && elem.item.start <= prevElem.item.end) ||
            (prevElem.item.start <= elem.item.end && elem.item.end <= prevElem.item.end) ||
            (prevElem.item.start >= elem.item.start && elem.item.end >= prevElem.item.end)
          ) && (
              (prevElem.cssTop <= elem.cssTop && elem.cssTop <= prevElemBottom) ||
              (prevElem.cssTop <= elemBottom && elemBottom <= prevElemBottom)
            )) {
            elem.cssTop = prevElemBottom + 1;
            prev = 0;
          }
        }

        elemBottom = elem.cssTop + this.minRowHeight + 1;
        if (this.sectionTravels[Number(prop)] && elemBottom > this.sectionTravels[Number(prop)].minRowHeight) {
          this.sectionTravels[Number(prop)].minRowHeight = elemBottom;
        }
      }
    }
  }

  changePeriod(period: Period, userTrigger: boolean = true, date?: Date) {
    this.currentPeriod = period;
    const _start = this.start;
    this.end = moment(_start).add(this.currentPeriod.timeFrameOverall, 'minutes').endOf('day');
    this.currentPeriodMinuteDiff = Math.abs(this.start.diff(this.end, 'minutes'));

    if (userTrigger && this.events.PeriodChange) {
      this.events.PeriodChange(this.start, this.end);
    }

    if (this.showBusinessDayOnly) {
      this.currentPeriodMinuteDiff -=
        (this.getNumberOfWeekendDays(moment(this.start), moment(this.end)) * this.currentPeriod.timeFramePeriod);
    }

    this.header = new Array<Header>();
    this.currentPeriod.timeFrameHeaders.forEach((ele: string, index: number) => {
      this.header.push(this.getDatesBetweenTwoDates(ele, index));
    });

    this.setTravelsInSectionTravels();
    this.showCurrentTimeIndicator();
  }

  changePeriodFull() {
    this.currentPeriod = this.periodSelect;

    const _start = this.start;
    this.end = moment(_start).add(this.currentPeriod.timeFrameOverall, 'minutes').endOf('day');
    this.currentPeriodMinuteDiff = Math.abs(this.start.diff(this.end, 'minutes'));

    if (this.events.PeriodChange) {
      this.events.PeriodChange(this.start, this.end);
    }

    if (this.showBusinessDayOnly) {
      this.currentPeriodMinuteDiff -=
        (this.getNumberOfWeekendDays(moment(this.start), moment(this.end)) * this.currentPeriod.timeFramePeriod);
    }

    this.header = new Array<Header>();
    this.currentPeriod.timeFrameHeaders.forEach((ele: string, index: number) => {
      this.header.push(this.getDatesBetweenTwoDates(ele, index));
    });

    this.setTravelsInSectionTravels();
    this.showCurrentTimeIndicator();
  }

  showCurrentTimeIndicator = () => {
    if (this.ShowCurrentTimeHandle) {
      clearTimeout(this.ShowCurrentTimeHandle);
    }

    const currentTime = moment();
    if (currentTime >= this.start && currentTime <= this.end) {
      this.currentTimeVisibility = 'visible';
      this.currentTimeIndicatorPosition = (
        (Math.abs(this.start.diff(currentTime, 'minutes')) / this.currentPeriodMinuteDiff) * 100
      ) + '%';
      this.currentTimeTitle = currentTime.format(this.currentTimeFormat);
    } else {
      this.currentTimeVisibility = 'hidden';
    }
    this.ShowCurrentTimeHandle = setTimeout(this.showCurrentTimeIndicator, 30000);
  }

  gotoToday() {
    this.start = moment().startOf('day');
    this.changePeriod(this.currentPeriod);
  }

  nextPeriod() {
    this.start.add(this.currentPeriod.timeFrameOverall, 'minutes');
    this.changePeriod(this.currentPeriod);
  }

  previousPeriod() {
    this.start.subtract(this.currentPeriod.timeFrameOverall, 'minutes');
    this.changePeriod(this.currentPeriod);
  }

  gotoDate(selectedDate: Date) {
    if (selectedDate) {
      this.selectedDate = selectedDate;
      const formattedDate = moment(selectedDate).format('YYYY-MM-DD');
      this.start = moment(formattedDate).startOf('day');
      this.changePeriod(this.currentPeriod);
    }
  }

  gotoDateFull(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const selectedDate = inputElement.value;

    if (selectedDate) {
      var date = selectedDate;
      console.log(date);

      const formattedDate = moment(selectedDate).format('YYYY-MM-DD');

      this.start = moment(formattedDate).startOf('day');

      this.changePeriod(this.currentPeriod);
    }
  }

  getDatesBetweenTwoDates(format: string, index: number): Header {
    const now = moment(this.start); // Ensure 'this.start' is a valid date
    const dates = new Header(); // Ensure 'Header' has 'headerDetails' array
    let prev: string | undefined; // Declare 'prev' as string or undefined
    let colspan = 0;

    while (now.isBefore(this.end) || now.isSame(this.end)) {
      // Check for business day condition if applicable
      if (!this.showBusinessDayOnly || (now.day() !== 0 && now.day() !== 6)) {
        const headerDetails = new HeaderDetails();
        headerDetails.name = now.locale(this.locale).format(format);

        if (prev && prev !== headerDetails.name) {
          colspan = 1; // Reset colspan if 'name' has changed
        } else {
          colspan++;
          dates.headerDetails.pop(); // Remove the last item to replace it with updated colspan
        }

        prev = headerDetails.name;
        headerDetails.colspan = colspan;

        // Add tooltip if available in 'currentPeriod.timeFrameHeadersTooltip'
        headerDetails.tooltip = this.currentPeriod.timeFrameHeadersTooltip && this.currentPeriod.timeFrameHeadersTooltip[index]
          ? now.locale(this.locale).format(this.currentPeriod.timeFrameHeadersTooltip[index])
          : '';

        dates.headerDetails.push(headerDetails);
      }

      // Add time frame increment
      now.add(this.currentPeriod.timeFramePeriod, 'minutes');
    }

    return dates;
  }

  getNumberOfWeekendDays(startDate: any, endDate: any) {
    let count = 0;
    while (startDate.isBefore(endDate) || startDate.isSame(endDate)) {
      if ((startDate.day() === 0 || startDate.day() === 6)) {
        count++;
      }
      startDate.add(this.currentPeriod.timeFramePeriod, 'minutes');
    }
    return count;
  }

  capitalizeWords(text: string): string {
    return text.replace(/\b\w/g, char => char.toUpperCase());
  }

  // drop(event: any) {
  //   event.item.data.sectionID = event.container.data.id;
  //   this.refreshView();
  //   this.events.TravelDropped(event.item.data);
  //   console.log(event.item.data)
  // }

  drop(event: CdkDragDrop<any>): void {
    const draggedItem = event.item.data; // Dados do item sendo arrastado
    const targetSection = event.container.data; // Dados do contêiner onde foi solto
    var eventToUpdate: any;

    if (draggedItem.id && targetSection.id) {
      this.spinner.show();
      this.travelService.getTravel(draggedItem.id).subscribe(
        response => {
          eventToUpdate = response;

          eventToUpdate.vehicle_id = targetSection.id;

          this.travelService.putTravel(eventToUpdate).subscribe(
            (responsePut: any) => {
              if (responsePut) {

                this.toastr.success("Viagem atualizada");

                const itemIndex = this.items.findIndex(item => item.id === responsePut.id);

                if (itemIndex !== -1) {
                  Object.assign(this.items[itemIndex], {vehicle: responsePut.vehicle_id, sectionID: responsePut.vehicle_id});
                  this.refreshView();
                  this.spinner.hide();
                } else {
                  console.error('Item não encontrado!');
                  this.spinner.hide();
                }

              }
            }
          )
        }
      );

    } else {
      this.toastr.show("Já tem uma viagem no mesmo horário.");
    }

  }

  itemPush() {
    this.subscription.add(this.service.itemAdd.asObservable().subscribe((item: Travel) => {
      this.items.push(item);
      this.refreshView();
    }));
  }

  itemPop() {
    this.subscription.add(this.service.item.asObservable().subscribe(() => {
      this.items.pop();
      this.refreshView();
    }));
  }

  itemRemove() {
    this.subscription.add(this.service.itemId.asObservable().subscribe((itemId: number) => {
      this.items.splice(this.items.findIndex((item) => {
        return item.id === itemId;
      }), 1);
      this.refreshView();
    }));
  }

  sectionPush() {
    this.subscription.add(this.service.sectionAdd.asObservable().subscribe((section: Section) => {
      this.sections.push(section);
      this.refreshView();
    }));
  }

  sectionPop() {
    this.subscription.add(this.service.section.asObservable().subscribe(() => {
      this.sections.pop();
      this.refreshView();
    }));
  }

  sectionRemove() {
    this.subscription.add(this.service.sectionId.asObservable().subscribe((sectionId: number) => {
      this.sections.splice(this.sections.findIndex((section) => {
        return section.id === sectionId;
      }), 1);
      this.refreshView();
    }));
  }

  refresh() {
    this.subscription.add(this.service.refreshView.asObservable().subscribe(() => {
      this.refreshView();
    }));
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    document.removeEventListener('fullscreenchange', this.onFullscreenChange);
    document.removeEventListener('webkitfullscreenchange', this.onFullscreenChange);
    document.removeEventListener('mozfullscreenchange', this.onFullscreenChange);
    document.removeEventListener('msfullscreenchange', this.onFullscreenChange);

  }

  onFullscreenChange = (): void => {
    if (!document.fullscreenElement) {
      this.isFullScreen = false;
    }
  };

  getStatusInPortuguese(statusClass: string): string {
    switch (statusClass) {
      case 'available':
        return 'Disponível';
      case 'in-use':
        return 'Em Uso';
      case 'under-maintenance':
        return 'Em Manutenção';
      case 'awaiting-maintenance':
        return 'Aguardando Manutenção';
      case 'reserved':
        return 'Reservado';
      case 'unavailable':
        return 'Indisponível';
      case 'out-of-service':
        return 'Fora de Serviço';
      case 'under-inspection':
        return 'Em Inspeção';
      case 'awaiting-inspection':
        return 'Aguardando Inspeção';
      case 'deactivated':
        return 'Desativado';
      default:
        return 'Status Desconhecido';
    }
  }

  createEmptySection(): Section {
    return {
      id: 0,
      name: "",
      tooltip: "",
      status: "",
      enterprise: "",
    } as Section;
  }

  reloadPage(): void {
    window.location.reload(); // Recarrega a página inteira
  }

  filterCompletes(className: string): void {
    this.itemsFiltereds = this.sectionTravels
      .map(sectionTravel => ({
        ...sectionTravel,
        itemMetas: sectionTravel.itemMetas.filter(meta => meta.item.classes === className)
      }))
      .filter(sectionTravel => sectionTravel.itemMetas.length > 0);
  }

  toggleFullscreen() {
    this.route.navigate(['/scheduler-large'])
  }

  openMenu(event: MouseEvent, menuTrigger: MatMenuTrigger) {
    event.preventDefault();
    event.stopPropagation();

    menuTrigger.openMenu();
  }

  getPlateForId(id: number) {
    var sectionTemp = this.sections.find(s => s.id === id)
    return sectionTemp?.name;
  }

  getDriverById(id: string) {
    var driverTemp = this.drivers.find(s => s.id === parseInt(id))
    return driverTemp?.full_name;
  }

  gotoScheduling() {
    this.route.navigate(['/scheduling']);
  }

}