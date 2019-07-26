export default class Database {
  db: Readonly<Array<any>>
  constructor () {
    this.db = []
  }
  set (id: string, data: any) {
    this.db.find(v => v.id)
  }

  get (id: string) {

  }
}