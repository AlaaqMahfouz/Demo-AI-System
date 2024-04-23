import { searchDatabase } from './searchDatabase';

export async function newSearch(structuredSearchString: string, inputNumber: number): Promise<any[]> {
    return searchDatabase(structuredSearchString, inputNumber, [])
  }