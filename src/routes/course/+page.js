
export async function load({ url }) {
    const index = parseInt(url.searchParams.get('index')) || 0
    return {
        index
    }
}