import {Provider} from "./provider";
import {Search} from "../model/search";
import {Data} from "../model/data";
import {Size} from "../model/size";
import { PeriodRange } from "../enum/period-range";
import {PageType} from "../enum/page-type";

export class Perfumehub implements Provider {
    private name = 'perfumehub.pl'
    private currency = 'zł'
    private host = 'https://perfumehub.pl'
    private apiHost = 'https://extension.isedo.pl'

    getData(name: string, page: PageType, id: number): Promise<Data> {
        const options = {
            method: "GET",
        };

        return fetch(this.apiHost + '/search/' + this.name + '/' + name + '?' +
            new URLSearchParams({
                page: String(page.toString()),
                id: String(id)
            }), options)
            .then((response) => response.json())
            .then((data) => Object.assign(new Search(), data))
            .then((search) => this.getPrices(search))
    }

    getPrices(search: Search): Promise<Data> {
        const options = {
            method: "GET",
        };
        return fetch(this.apiHost + '/proxy/' + this.name + search.path, options)
            .then((response) => response.json())
            .then((data) => Object.assign(new Data(), data))
            .then((data) => data)
    }

    hasPriceHistory(): boolean {
        return true;
    }

    getPriceHistory(params: Size, range: PeriodRange): Promise<any> {
        const options = {
            method: "GET",
        };
        return fetch(this.apiHost + '/price-history/' + this.name + '?' +
            new URLSearchParams({
                size: String(params.size),
                brand: params.brand,
                line: params.line,
                gender: params.gender,
                type: params.type,
                tester: String(params.tester),
                isSet: String(params.set),
                period: range
            })
            , options)
            .then((response) => response.json())
    }

    getName(): string {
        return this.name
    }

    getCurrency(): string {
        return this.currency
    }

    getHost(): string {
        return this.host
    }

    getApiHost(): string {
        return this.apiHost
    }
}