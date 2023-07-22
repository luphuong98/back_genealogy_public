export class Person {
  firstName: string;
  lastName: string;
  phone: string;
  mail: string;
  address: string;
  birth_place: string;
  burial_place: string;
  gender: string;
  birthday: Date;
  death_date: Date;
  note: Text;
  ancestors: Array<Person>;
  parent: Person;
}
