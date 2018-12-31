import { Injectable } from '@angular/core';

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'

//estos son los campos que irán en nuestra base 
//de datos de firebase, si queremos añadir más campos
//los tenemos que añadir dentro de los corchetes
export interface Item { name: string; }
export interface ItemId extends Item { id: string; }

@Injectable({
  providedIn: 'root'
})
export class ConexionService {
  //creamos una variable que va a ser de tipo 
  //AngularFirestoreCollection que a su vez va ser de tipo Item
  private itemsCollection: AngularFirestoreCollection<Item>;
  //creamos otra variable que va a ser de tipo Observable
  //y a su vez de tipo array de Item
  items: Observable<ItemId[]>;

  private itemDoc: AngularFirestoreDocument<Item>;

  constructor(private readonly afs: AngularFirestore) {
    this.itemsCollection = afs.collection<Item>('items');
    // this.items = this.itemsCollection.valueChanges();
    this.items = this.itemsCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Item;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  listaItem() {
    return this.items;
  }

  addItem(item: Item) {
    this.itemsCollection.add(item);
  }

  eliminarItem(item){
    this.itemDoc = this.afs.doc<Item>(`items/${item.id}`);
    this.itemDoc.delete();
  }

  editarItem(item){
    this.itemDoc = this.afs.doc<Item>(`items/${item.id}`);
    this.itemDoc.update(item);
  }




}
