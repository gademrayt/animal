'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function addMetric(formData: FormData) {
  const supabase = await createClient()
  
  const petId = formData.get('pet_id') as string
  const weightStr = formData.get('weight') as string
  const activityStr = formData.get('activity_level') as string
  
  const metricData = {
    pet_id: petId,
    date: formData.get('date') as string,
    weight: weightStr ? parseFloat(weightStr) : null,
    activity_level: activityStr ? parseInt(activityStr) : null,
    diet: formData.get('diet') as string,
    notes: formData.get('notes') as string,
  }

  const { error } = await supabase.from('health_metrics').insert(metricData)

  if (error) {
    redirect(`/dashboard/pet/${petId}?error=Could not add metrics. Need DB schema.`)
  }

  revalidatePath(`/dashboard/pet/${petId}`)
  redirect(`/dashboard/pet/${petId}`)
}
