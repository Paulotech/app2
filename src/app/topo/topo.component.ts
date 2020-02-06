import { Component, OnInit } from '@angular/core';
import { OfertasService } from '../ofertas.service'
import { Observable, Subject, of } from 'rxjs';
import { Oferta } from '../shared/oferta.model';
import { switchMap, debounceTime, distinctUntilChanged, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-topo',
  templateUrl: './topo.component.html',
  styleUrls: ['./topo.component.css'],
  providers: [ OfertasService ]
})
export class TopoComponent implements OnInit {

  public ofertas: Observable<Oferta[]>
 
  private subjectPesquisa: Subject<string> = new Subject<string>()
  
  constructor(private ofertasSevice: OfertasService) { }

  ngOnInit() {
    this.ofertas  =  this.subjectPesquisa // retorno Oferta[]
      .pipe(
        debounceTime(1000), // executa a ação do switch map  após 1 segundo
        distinctUntilChanged(),
        switchMap(( termo: string ) => {
          if(termo.trim() === '') {
            // retornar um observable de array de ofertas vazio
            return  of<Oferta[]>([]); 

          } 
          return this.ofertasSevice.pesquisaOfertas(termo)
        }),
        catchError ((erro) => {
          return of<Oferta[]>([])
         })
      )
    
    
  }

  public pesquisa(termoDaBusca: string): void {
    this.subjectPesquisa.next(termoDaBusca)
  }

  public limpaPesquisa(): void {
    this.subjectPesquisa.next('')
  }
}
