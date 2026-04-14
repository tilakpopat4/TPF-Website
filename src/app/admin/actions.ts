'use server'

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

import path from "path"

// Projects
export async function addProject(formData: FormData) {
  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const trailerUrl = formData.get('trailerUrl') as string | null
  const bannerUrl = formData.get('bannerUrl') as string | null
  const youtubeUrl = formData.get('youtubeUrl') as string | null
  const releaseDateStr = formData.get('releaseDate') as string | null
  
  if (title && description) {
    await prisma.project.create({
      data: { 
        title, 
        description, 
        ...(trailerUrl && { trailerUrl }),
        ...(bannerUrl && { bannerUrl }),
        ...(youtubeUrl && { youtubeUrl }),
        ...(releaseDateStr && { releaseDate: new Date(releaseDateStr) })
      }
    })
    revalidatePath('/')
    revalidatePath('/admin')
    revalidatePath('/announcements')
  }
}

export async function deleteProject(id: string) {
  await prisma.project.delete({ where: { id } })
  revalidatePath('/')
  revalidatePath('/admin')
}

// Music
export async function addMusic(formData: FormData) {
  const title = formData.get('title') as string
  const audioUrl = formData.get('audioUrl') as string | null
  const posterUrl = formData.get('posterUrl') as string | null
  
  if (title && audioUrl) {
    await prisma.music.create({
      data: { 
        title, 
        audioUrl, 
        ...(posterUrl && { posterUrl })
      }
    })
    revalidatePath('/music')
    revalidatePath('/admin')
  }
}

export async function deleteMusic(id: string) {
  await prisma.music.delete({ where: { id } })
  revalidatePath('/music')
  revalidatePath('/admin')
}

// Cast & Crew
export async function addCastCrew(formData: FormData) {
  const name = formData.get('name') as string
  const role = formData.get('role') as string
  const imageUrl = formData.get('imageUrl') as string | null
  
  if (name && role) {
    await prisma.castCrew.create({
      data: { 
        name, 
        role, 
        ...(imageUrl && { imageUrl }) 
      }
    })
    revalidatePath('/cast-crew')
    revalidatePath('/admin')
  }
}

export async function deleteCastCrew(id: string) {
  await prisma.castCrew.delete({ where: { id } })
  revalidatePath('/cast-crew')
  revalidatePath('/admin')
}

// Posters
export async function addPoster(formData: FormData) {
  const title = formData.get('title') as string
  const imageUrl = formData.get('imageUrl') as string | null
  
  if (title && imageUrl) {
    await prisma.poster.create({
      data: { 
        title, 
        imageUrl 
      }
    })
    revalidatePath('/posters')
    revalidatePath('/admin')
  }
}

export async function deletePoster(id: string) {
  await prisma.poster.delete({ where: { id } })
  revalidatePath('/posters')
  revalidatePath('/admin')
}

// Announcements
export async function addAnnouncement(formData: FormData) {
  const title = formData.get('title') as string
  const content = formData.get('content') as string
  const imageUrl = formData.get('imageUrl') as string | null
  
  if (title && content) {
    await prisma.announcement.create({
      data: { 
        title, 
        content, 
        ...(imageUrl && { imageUrl }) 
      }
    })
    revalidatePath('/announcements')
    revalidatePath('/admin')
  }
}

export async function deleteAnnouncement(id: string) {
  await prisma.announcement.delete({ where: { id } })
  revalidatePath('/announcements')
  revalidatePath('/admin')
}

// YouTube Metadata Fetcher
export async function fetchYouTubeInfo(url: string) {
  try {
    const response = await fetch(url);
    const html = await response.text();
    
    // Simple regex to extract meta tags
    const titleMatch = html.match(/<title>(.*?)<\/title>/);
    const descMatch = html.match(/meta name="description" content="(.*?)"/);
    const ogDescMatch = html.match(/property="og:description" content="(.*?)"/);
    
    let title = titleMatch ? titleMatch[1].replace(" - YouTube", "") : "";
    let description = (ogDescMatch ? ogDescMatch[1] : (descMatch ? descMatch[1] : ""));
    
    return { title, description };
  } catch (error) {
    console.error("Fetch YouTube Error:", error);
    return null;
  }
}
