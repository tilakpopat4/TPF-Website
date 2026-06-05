'use server'

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

import path from "path"

// Projects
export async function addProject(formData: FormData) {
  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const bannerUrl = formData.get('bannerUrl') as string | null
  const youtubeUrl = formData.get('youtubeUrl') as string | null
  const releaseDateStr = formData.get('releaseDate') as string | null
  
  if (title && description) {
    const count = await prisma.project.count()
    await prisma.project.create({
      data: { 
        title, 
        description, 
        order: count,
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

// Behind The Scenes
export async function addBTS(formData: FormData) {
  const title = formData.get('title') as string
  const videoUrl = formData.get('videoUrl') as string | null
  const thumbnail = formData.get('thumbnail') as string | null
  
  if (title && (videoUrl || thumbnail)) {
    const count = await prisma.behindTheScene.count()
    await prisma.behindTheScene.create({
      data: { 
        title, 
        order: count,
        ...(videoUrl && { videoUrl }),
        ...(thumbnail && { thumbnail })
      }
    })
    revalidatePath('/')
    revalidatePath('/admin')
  }
}

export async function deleteBTS(id: string) {
  await prisma.behindTheScene.delete({ where: { id } })
  revalidatePath('/')
  revalidatePath('/admin')
}

export async function deleteProject(id: string) {
  try {
    await prisma.project.delete({ where: { id } })
    revalidatePath('/')
    revalidatePath('/admin')
    return { success: true }
  } catch (error: any) {
    console.error("deleteProject error:", error)
    return { success: false, error: error.message || String(error) }
  }
}

// Music
export async function addMusic(formData: FormData) {
  const title = formData.get('title') as string
  const audioUrl = formData.get('audioUrl') as string | null
  const posterUrl = formData.get('posterUrl') as string | null
  
  if (title && audioUrl) {
    const count = await prisma.music.count()
    await prisma.music.create({
      data: { 
        title, 
        audioUrl, 
        order: count,
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
    const count = await prisma.castCrew.count()
    await prisma.castCrew.create({
      data: { 
        name, 
        role, 
        order: count,
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
    const count = await prisma.poster.count()
    await prisma.poster.create({
      data: { 
        title, 
        imageUrl,
        order: count
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
    const count = await prisma.announcement.count()
    await prisma.announcement.create({
      data: { 
        title, 
        content, 
        order: count,
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
    
    const titleMatch = html.match(/<title>(.*?)<\/title>/);
    const ogDescMatch = html.match(/property="og:description" content="(.*?)"/);
    const descMatch = html.match(/meta name="description" content="(.*?)"/);
    
    let title = titleMatch ? titleMatch[1].replace(" - YouTube", "") : "";
    let description = (ogDescMatch ? ogDescMatch[1] : (descMatch ? descMatch[1] : ""));
    
    return { title, description };
  } catch (error) {
    console.error("Fetch YouTube Error:", error);
    return null;
  }
}

// Site Settings
export async function updateSetting(key: string, value: string) {
  await prisma.settings.upsert({
    where: { key },
    update: { value, updatedAt: new Date() },
    create: { key, value },
  })
  revalidatePath('/')
  revalidatePath('/music')
  revalidatePath('/admin')
}

// Update Actions

export async function updateProject(id: string, formData: FormData) {
  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const bannerUrl = formData.get('bannerUrl') as string | null
  const youtubeUrl = formData.get('youtubeUrl') as string | null
  const releaseDateStr = formData.get('releaseDate') as string | null

  if (title && description) {
    try {
      await prisma.project.update({
        where: { id },
        data: {
          title,
          description,
          bannerUrl: bannerUrl || null,
          youtubeUrl: youtubeUrl || null,
          releaseDate: releaseDateStr ? new Date(releaseDateStr) : null
        }
      })
      revalidatePath('/')
      revalidatePath('/admin')
      revalidatePath('/announcements')
      return { success: true }
    } catch (error: any) {
      console.error("updateProject error:", error)
      return { success: false, error: error.message || String(error) }
    }
  }
  return { success: false, error: "Title and description are required." }
}

export async function updateBTS(id: string, formData: FormData) {
  const title = formData.get('title') as string
  const videoUrl = formData.get('videoUrl') as string | null
  const thumbnail = formData.get('thumbnail') as string | null

  if (title) {
    await prisma.behindTheScene.update({
      where: { id },
      data: {
        title,
        videoUrl: videoUrl || null,
        thumbnail: thumbnail || null
      }
    })
    revalidatePath('/')
    revalidatePath('/admin')
  }
}

export async function updateMusic(id: string, formData: FormData) {
  const title = formData.get('title') as string
  const audioUrl = formData.get('audioUrl') as string | null
  const posterUrl = formData.get('posterUrl') as string | null

  if (title && audioUrl) {
    await prisma.music.update({
      where: { id },
      data: {
        title,
        audioUrl,
        posterUrl: posterUrl || null
      }
    })
    revalidatePath('/music')
    revalidatePath('/admin')
  }
}

export async function updateCastCrew(id: string, formData: FormData) {
  const name = formData.get('name') as string
  const role = formData.get('role') as string
  const imageUrl = formData.get('imageUrl') as string | null

  if (name && role) {
    await prisma.castCrew.update({
      where: { id },
      data: {
        name,
        role,
        imageUrl: imageUrl || null
      }
    })
    revalidatePath('/cast-crew')
    revalidatePath('/admin')
  }
}

export async function updatePoster(id: string, formData: FormData) {
  const title = formData.get('title') as string
  const imageUrl = formData.get('imageUrl') as string | null

  if (title && imageUrl) {
    await prisma.poster.update({
      where: { id },
      data: {
        title,
        imageUrl
      }
    })
    revalidatePath('/posters')
    revalidatePath('/admin')
  }
}

export async function updateAnnouncement(id: string, formData: FormData) {
  const title = formData.get('title') as string
  const content = formData.get('content') as string
  const imageUrl = formData.get('imageUrl') as string | null

  if (title && content) {
    await prisma.announcement.update({
      where: { id },
      data: {
        title,
        content,
        imageUrl: imageUrl || null
      }
    })
    revalidatePath('/announcements')
    revalidatePath('/admin')
  }
}

// Reorder Actions

export async function reorderProjects(ids: string[]) {
  for (let i = 0; i < ids.length; i++) {
    await prisma.project.update({
      where: { id: ids[i] },
      data: { order: i }
    })
  }
  revalidatePath('/')
  revalidatePath('/admin')
  revalidatePath('/announcements')
}

export async function reorderBTS(ids: string[]) {
  for (let i = 0; i < ids.length; i++) {
    await prisma.behindTheScene.update({
      where: { id: ids[i] },
      data: { order: i }
    })
  }
  revalidatePath('/')
  revalidatePath('/admin')
}

export async function reorderMusic(ids: string[]) {
  for (let i = 0; i < ids.length; i++) {
    await prisma.music.update({
      where: { id: ids[i] },
      data: { order: i }
    })
  }
  revalidatePath('/music')
  revalidatePath('/admin')
}

export async function reorderCastCrew(ids: string[]) {
  for (let i = 0; i < ids.length; i++) {
    await prisma.castCrew.update({
      where: { id: ids[i] },
      data: { order: i }
    })
  }
  revalidatePath('/cast-crew')
  revalidatePath('/admin')
}

export async function reorderPoster(ids: string[]) {
  for (let i = 0; i < ids.length; i++) {
    await prisma.poster.update({
      where: { id: ids[i] },
      data: { order: i }
    })
  }
  revalidatePath('/posters')
  revalidatePath('/admin')
}

export async function reorderAnnouncement(ids: string[]) {
  for (let i = 0; i < ids.length; i++) {
    await prisma.announcement.update({
      where: { id: ids[i] },
      data: { order: i }
    })
  }
  revalidatePath('/announcements')
  revalidatePath('/admin')
}
