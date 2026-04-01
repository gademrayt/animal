'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function addPet(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Not authenticated')

  const petData = {
    user_id: user.id,
    name: formData.get('name') as string,
    species: formData.get('species') as string,
    breed: formData.get('breed') as string,
    birth_date: formData.get('birth_date') as string || null,
  }

  const { error } = await supabase.from('pets').insert(petData)

  if (error) {
    redirect('/dashboard/add-pet?error=Could not add pet. Has the DB schema been setup?')
  }

  revalidatePath('/dashboard')
  redirect('/dashboard')
}
