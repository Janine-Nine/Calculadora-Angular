import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.css']
})
export class CalculatorComponent {
  display: string = '0';
  firstValue: number | null = null;
  operator: string | null = null;
  waitingForSecondValue: boolean = false;

  // Captura teclado
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    const key = event.key;

    if (!isNaN(Number(key))) {
      this.pressNumber(key);
    } else if (['+', '-', '*', '/'].includes(key)) {
      this.pressOperator(key);
    } else if (key === 'Enter' || key === '=') {
      this.pressEquals();
      event.preventDefault();
    } else if (key === '.') {
      this.pressDecimal();
    } else if (key.toLowerCase() === 'c' || key === 'Escape') {
      this.clear();
    } else if (key === 'Backspace') {
      this.backspace();
    }
  }

  // inserir números
  pressNumber(num: string) {
    if (this.waitingForSecondValue) {
      this.display = num;
      this.waitingForSecondValue = false;
    } else {
      this.display = this.display === '0' ? num : this.display + num;
    }
  }

  // ponto decimal
  pressDecimal() {
    if (this.waitingForSecondValue) {
      this.display = '0.';
      this.waitingForSecondValue = false;
      return;
    }
    if (!this.display.includes('.')) {
      this.display += '.';
    }
  }

  // operadores básicos
  pressOperator(op: string) {
    if (this.firstValue === null) {
      this.firstValue = parseFloat(this.display);
    } else if (this.operator) {
      this.firstValue = this.calculate(this.firstValue, parseFloat(this.display), this.operator);
      this.display = String(this.firstValue);
    }
    this.operator = op;
    this.waitingForSecondValue = true;
  }

  // resultado
  pressEquals() {
    if (this.operator && this.firstValue !== null) {
      const result = this.calculate(this.firstValue, parseFloat(this.display), this.operator);
      this.display = String(result);
      this.firstValue = null;
      this.operator = null;
    }
  }

  // limpar
  clear() {
    this.display = '0';
    this.firstValue = null;
    this.operator = null;
    this.waitingForSecondValue = false;
  }

  // backspace
  backspace() {
    if (this.display.length > 1) {
      this.display = this.display.slice(0, -1);
    } else {
      this.display = '0';
    }
  }

  // funções científicas
  pressFunction(func: string) {
    const value = parseFloat(this.display);
    let result = value;

    switch (func) {
      case 'sqrt': result = Math.sqrt(value); break;
      case 'square': result = Math.pow(value, 2); break;
      case 'inverse': result = 1 / value; break;
      case 'sign': result = -value; break;
      case 'sin': result = Math.sin(value * Math.PI / 180); break; // em graus
      case 'cos': result = Math.cos(value * Math.PI / 180); break;
      case 'tan': result = Math.tan(value * Math.PI / 180); break;
      case 'log': result = Math.log10(value); break;
      case 'ln': result = Math.log(value); break;
      default: break;
    }

    this.display = String(result);
  }

  // cálculo
  private calculate(a: number, b: number, operator: string): number {
    switch (operator) {
      case '+': return a + b;
      case '-': return a - b;
      case '*': return a * b;
      case '/': return b !== 0 ? a / b : NaN;
      case '^': return Math.pow(a, b);
      default: return b;
    }
  }
}

