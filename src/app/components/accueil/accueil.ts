import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Tag} from 'primeng/tag';
import {Button} from 'primeng/button';
import {Chip} from 'primeng/chip';
import {Card} from 'primeng/card';

@Component({
  selector: 'app-accueil',
  standalone: true,
  imports: [CommonModule, Tag, Button, Chip, Card],
  templateUrl: './accueil.html',
  styleUrls: []
})
export class Accueil {
  constructor() {}

  /**
   * Fait défiler en douceur vers une section spécifique
   */
  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }
}
