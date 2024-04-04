import { ChangeDetectorRef, Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { BrowserMultiFormatReader, NotFoundException } from '@zxing/library';
import { CommonModule } from '@angular/common';
import { BarCode } from './bar-code.model';
import { Stack } from './stack.model';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent implements OnInit{
  
  title: any;

  isScanning = false;

  @ViewChild('videoElement') videoElement: ElementRef | null = null;
  videoInputDevices: MediaDeviceInfo[] = [];
  selectedDeviceId: string | null = null;
  result: string = '';

  codeReader: BrowserMultiFormatReader = new BrowserMultiFormatReader();

  barcodeStack = new Stack<BarCode>();

  constructor(private cdr: ChangeDetectorRef) {};

  ngOnInit(): void {
    this.codeReader.listVideoInputDevices()
      .then((devices) => {
        this.videoInputDevices = devices;
        if (devices.length > 0) {
          this.selectedDeviceId = devices[0].deviceId;
        }
      })
      .catch((err) => console.error(err));
  }

  private scan(): void {
    if (this.videoElement && this.videoElement.nativeElement) {
      
      this.codeReader.timeBetweenDecodingAttempts = 1000;
      this.codeReader.decodeFromVideoDevice(this.selectedDeviceId, this.videoElement.nativeElement, (result, err) => {
        if (result) {
          
          let barCode = new BarCode(result.getBarcodeFormat(), result.getText());

          this.barcodeStack.push(barCode);

          console.log(barCode.toString());
          //this.cdr.detectChanges();
          //this.codeReader.stopContinuousDecode();

        } else if (err && !(err instanceof NotFoundException)) {
            console.error(err);
            //this.scanningEnabled = true;
        }
      });
      console.log(`Started continuous decode from camera with id ${this.selectedDeviceId}`);
    }
  }

  startScan(): void {
    this.isScanning = true;
    this.scan();
  }

  stopScan(): void {
    this.isScanning = false;
    this.codeReader.stopContinuousDecode();
    console.log('Scanning stopped, camera still on.');
  }

  resetScan(): void {
    this.isScanning = false;
    this.codeReader.reset();
    this.result = '';
    this.barcodeStack.clear();
    //this.scanningEnabled = true;
    console.log('Reset.');
  }

  traverse(): string {
    let results = "";
    const items = this.barcodeStack.getStack();
  
    for (let i = 0; i < items.length; i++) {
      results += items[i].toString() + '\n';
    }
    return results.trim();
  }
  
  requestCameraPermission(): void {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        // The user granted permission
        // You can now do something with the video stream, for example:
        if (this.videoElement) {
          this.videoElement.nativeElement.srcObject = stream;
        }
      })
      .catch(err => {
        // The user denied permission, or another error occurred
        console.error('Camera access denied', err);
      });
  }
}