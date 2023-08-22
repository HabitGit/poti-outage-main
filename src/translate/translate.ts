import { StreetsRepository } from '../social/repository/streets.repository';
import { Streets } from '../db/entitys/streets.entity';

const alphabet: Map<string, string> = new Map<string, string>([
  ['ა', 'a'],
  ['ბ', 'b'],
  ['გ', 'g'],
  ['დ', 'd'],
  ['ე', 'e'],
  ['ვ', 'v'],
  ['ზ', 'z'],
  ['თ', 't'],
  ['ი', 'i'],
  ['კ', 'k'],
  ['ლ', 'l'],
  ['მ', 'm'],
  ['ნ', 'n'],
  ['ო', 'o'],
  ['პ', 'p'],
  ['ჟ', 'zh'],
  ['რ', 'r'],
  ['ს', 's'],
  ['ტ', 't'],
  ['უ', 'u'],
  ['ფ', 'p'],
  ['ქ', 'k'],
  ['ღ', 'gh'],
  ['ყ', 'q'],
  ['შ', 'sh'],
  ['ჩ', 'ch'],
  ['ც', 'ts'],
  ['ძ', 'dz'],
  ['წ', 'ts'],
  ['ჭ', 'ch'],
  ['ხ', 'kh'],
  ['ჯ', 'j'],
  ['ჰ', 'h'],
]);

export class Translate {
  constructor(private streetsRepository: StreetsRepository) {}

  async translateToRusInDb() {
    const streets: Streets[] = await this.streetsRepository.getStreets();
    console.log('str: ', streets);
    for (const street of streets) {
      let result: string = '';
      for (let i = 0; i < street.nameGeo.length; ++i) {
        if (alphabet.get(street.nameGeo[i]) === undefined) {
          result += street.nameGeo[i];
        } else {
          result += alphabet.get(street.nameGeo[i]);
        }
      }
      await this.streetsRepository.updateStreetById({
        ...street,
        nameEng: result,
      });
    }
  }

  translateFromGeoToRus(streets: string[]): string[] {
    const finalResult: string[] = [];
    for (const street of streets) {
      if (street === undefined) continue;
      let result: string = '';
      for (let i = 0; i < street.length; ++i) {
        if (alphabet.get(street[i]) === undefined) {
          result += street[i];
        } else {
          result += alphabet.get(street[i]);
        }
      }
      finalResult.push(result);
    }
    return finalResult;
  }
}
