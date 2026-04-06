import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';

@Injectable()
export class DateValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    // Si c'est le corps de la requête
    if (metadata.type === 'body' && value) {
      console.log('DateValidationPipe: input:', value);
      
      // Convertir birthDate de string à Date
      if (value.birthDate && typeof value.birthDate === 'string') {
        const date = new Date(value.birthDate);
        console.log('DateValidationPipe: converting birthDate:', value.birthDate, '->', date);
        
        if (isNaN(date.getTime())) {
          throw new BadRequestException('Date de naissance invalide');
        }
        
        value.birthDate = date;
      }
      
      // Convertir parentId de string à number
      if (value.parentId && typeof value.parentId === 'string') {
        const num = Number(value.parentId);
        console.log('DateValidationPipe: converting parentId:', value.parentId, '->', num);
        
        if (isNaN(num)) {
          throw new BadRequestException('parentId doit être un nombre valide');
        }
        
        value.parentId = num;
      }
      
      console.log('DateValidationPipe: final output:', value);
    }
    return value;
  }
}
