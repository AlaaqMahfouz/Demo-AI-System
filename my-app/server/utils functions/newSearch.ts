import { searchDatabase } from './searchDatabase';

export async function newSearch(structuredSearchString: string, inputNumber: number): Promise<any[]> {
  console.log("string parsed in new search :" + structuredSearchString)
    return searchDatabase(structuredSearchString, inputNumber, [])
  }