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
  
  if (title && description) {
    await prisma.project.create({
      data: { 
        title, 
        description, 
        ...(trailerUrl && { trailerUrl }),
        ...(bannerUrl && { bannerUrl })
      }
    })
    revalidatePath('/')
    revalidatePath('/admin')
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
