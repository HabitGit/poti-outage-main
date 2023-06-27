import axios, {AxiosResponse} from "axios";
import jsdom from "jsdom";

const LINK = process.env.WATER_LINK;
const POTI = 'ფოთის ';
const QUERY_START = 'div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2)';
const QUERY_END = 'div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(3)';

const { JSDOM } = jsdom;

export class WaterParser {
    constructor() {}

    async getWaterInfo(): Promise<Array<{start: string, end: string}>> {
        if ( !LINK ) throw new Error('Нету ссылки на сайт')

        //Axios request
        let html: string = '';
        try {
            const resp: AxiosResponse = await axios.get(LINK)
            html = resp.data;
        } catch (err) {
            if (axios.isAxiosError(err)) {
                console.log('Ошибка аксисоса: ', err)
            } else {
                console.log('Иная ошибка при получении данных с сайта: ', err)
            }
        }

        //Get html dom
        const dom: jsdom.JSDOM = new JSDOM(html);
        const document: Document = dom.window.document;
        const items: NodeListOf<Element> = document.querySelectorAll('[class="panel panel-default"]')

        //Search info about country
        const infoInMyCountry: Array<Element | null> = []
        items.forEach(item => {
            const query: Element | null = item.querySelector(('[data-toggle="collapse"]'))
            if ( query === null ) throw new Error('Item is null')

            const isTextQuery: string | null = query.textContent
            if ( isTextQuery === null ) throw new Error('Нету текста у объекта')

            const isCityName = isTextQuery.indexOf(POTI)
            if ( isCityName >= 0 ) infoInMyCountry.push(item.querySelector('[class="col-sm-12"]'))
        })

        //get text
        let resultText: Array<{start: string, end: string}> = []
        infoInMyCountry.forEach((item, i) => {
            if (item != null) {
                const startQuery: Element | null = item.querySelector(QUERY_START)
                if ( startQuery === null ) throw new Error('Нету селектора старта')
                const endQuery: Element | null = item.querySelector(QUERY_END)
                if ( endQuery === null ) throw new Error('Нету квери окончания')
                const startQueryText: string | null = startQuery.textContent
                if( startQueryText === null ) throw new Error('Нету текста у селектора начала')
                const endQueryText: string | null = endQuery.textContent
                if ( endQueryText === null ) throw new Error('Нету текста у селектора окончания')
                const start: string = startQueryText.split(': ')[1]
                const end: string = endQueryText.split(': ')[1]
                resultText.push({
                    start: start,
                    end: end,
                });
            }
        })
        return resultText
    }

}