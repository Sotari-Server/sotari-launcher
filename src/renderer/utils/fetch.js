export async function fetchAllNews() {
  return fetch('https://admin.sotari.eu/items/news').then(async (response) => {
    const data = await response.json();
    return data.data;
  });
}
