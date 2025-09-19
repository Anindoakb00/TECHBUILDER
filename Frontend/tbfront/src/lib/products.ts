import { BACKEND_ORIGIN } from './images'

function pickImage(item: any) {
  if (item.images && item.images.length > 0) return item.images[0].image || ''
  if (item.image) return item.image
  return ''
}

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

const CATEGORY_KEYWORDS: Record<string, string[]> = {
  laptops: ['laptop','macbook','notebook','dell','lenovo','asus','acer','hp'],
  gadgets: ['tablet','watch','smartwatch','charger','headphone','headphones','monitor','speaker','ssd','camera'],
  accessories: ['case','cover','charger','cable','adapter','mouse','keyboard','protector'],
  tools: ['tool','screwdriver','wrench','drill']
}

function inferCategorySlug(name: string, categoryFromApi: string) {
  const apiSlug = slugify(categoryFromApi || '')
  if (apiSlug) return apiSlug
  const lower = (name || '').toLowerCase()
  for (const [slug, kws] of Object.entries(CATEGORY_KEYWORDS)) {
    for (const kw of kws) if (lower.includes(kw)) return slug
  }
  return ''
}

export async function getFeaturedProducts() {
  try {
    const res = await fetch(`${BACKEND_ORIGIN}/api/products/`)
    if (!res.ok) throw new Error('Failed to fetch')
    const data = await res.json()
    
    const items = data.slice(0, 6).map((it: any) => ({
      id: it.id,
      name: it.name,
      price: it.price,
      category: it.category_name || it.category || '',
      categorySlug: inferCategorySlug(it.name, it.category_name || it.category || ''),
      brand: it.brand_name || it.brand || '',
      image: pickImage(it) || '/file.svg',
    }))
    return items
  } catch (e) {
    console.error('getFeaturedProducts failed', e)
    return []
  }
}

export async function getAllProducts() {
  try {
    const res = await fetch(`${BACKEND_ORIGIN}/api/products/`)
    if (!res.ok) throw new Error('Failed to fetch')
    const data = await res.json()
    return data.map((it: any) => ({
      id: it.id,
      name: it.name,
      price: it.price,
      category: it.category_name || it.category || '',
      categorySlug: inferCategorySlug(it.name, it.category_name || it.category || ''),
      brand: it.brand_name || it.brand || '',
      image: pickImage(it) || '/file.svg',
    }))
  } catch (e) {
    console.error('getAllProducts failed', e)
    return []
  }
}

export async function getProductById(id:number) {
  try {
    const res = await fetch(`${BACKEND_ORIGIN}/api/products/${id}/`)
    if (!res.ok) throw new Error('Failed to fetch')
    const it = await res.json()
    return {
      id: it.id,
      name: it.name,
      price: it.price,
      description: it.description || '',
      images: (it.images && it.images.length > 0) ? it.images.map((im: any) => im.image || '/file.svg') : [it.image || '/file.svg'],
      category: it.category_name || it.category || '',
      categorySlug: inferCategorySlug(it.name, it.category_name || it.category || ''),
      specs: it.specs || '',
    }
  } catch (e) {
    console.error('getProductById failed', e)
    throw e
  }
}
