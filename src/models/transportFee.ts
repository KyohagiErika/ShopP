import { HttpStatusCode } from '../utils/shopp.enum';
import Response from '../utils/response';
import nodeGeocoder from 'node-geocoder';

const geoCoder = nodeGeocoder({
  provider: 'openstreetmap',
});

export default class TransportFeeModel {
  static async getTransportFee(
    placeOfReceipt: string,
    placeOfDelivery: string
  ) {
    const coordinatesOfReceipt = await this.validAddress(placeOfReceipt);
    const coordinatesOfDelivery = await this.validAddress(placeOfDelivery);
    if (
      coordinatesOfReceipt.getCode() == HttpStatusCode.OK &&
      coordinatesOfReceipt.getCode() == HttpStatusCode.OK
    ) {
      const distance = this.distance(
        coordinatesOfReceipt.getData().latitude,
        coordinatesOfReceipt.getData().longitude,
        coordinatesOfDelivery.getData().latitude,
        coordinatesOfDelivery.getData().longitude
      );
      var transportFee;
      if (distance <= 1) {
        transportFee = 0;
      } else if (distance <= 10) {
        transportFee = 15000;
      } else if (distance <= 60) {
        transportFee = 30000;
      } else if (distance <= 200) {
        transportFee = 40000;
      } else {
        transportFee = 50000;
      }
      return new Response(HttpStatusCode.OK, 'Success', {
        transportFee: transportFee,
      });
    }
    return new Response(HttpStatusCode.BAD_REQUEST, 'Invalid address');
  }

  static async validAddress(address: string) {
    return geoCoder
      .geocode(address)
      .then(res => {
        if (res.length > 0) {
          return new Response(HttpStatusCode.OK, 'Correct address', {
            latitude: res[0].latitude,
            longitude: res[0].longitude,
          });
        }
        return new Response(HttpStatusCode.BAD_REQUEST, 'Address not found');
      })
      .catch(err => {
        return new Response(HttpStatusCode.BAD_REQUEST, 'Address not found');
      });
  }

  static distance(
    latitude1: number,
    longitude1: number,
    latitude2: number,
    longitude2: number
  ) {
    const radianLatitude1 = (Math.PI * latitude1) / 180;
    const radianLatitude2 = (Math.PI * latitude2) / 180;
    const radianLongitude1 = (Math.PI * longitude1) / 180;
    const radianLongitude2 = (Math.PI * longitude2) / 180;

    const radianTheta = radianLongitude1 - radianLongitude2;
    var distance =
      Math.sin(radianLatitude1) * Math.sin(radianLatitude2) +
      Math.cos(radianLatitude1) *
        Math.cos(radianLatitude2) *
        Math.cos(radianTheta);

    distance = Math.acos(distance);
    distance = (distance * 180) / Math.PI;
    distance = distance * 60 * 1.1515;
    distance = distance * 1.609344;

    return Math.round(distance * 1000) / 1000;
  }
}
