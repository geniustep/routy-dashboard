import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { serviceRequestService } from '@/api/services/serviceRequestService'
import { message } from 'ant-design-vue'
import { ref } from 'vue'

export function useServiceRequests(filters?: any) {
  const queryClient = useQueryClient()

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['serviceRequests', filters],
    queryFn: () => serviceRequestService.getAll(filters),
  })

  const createMutation = useMutation({
    mutationFn: serviceRequestService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['serviceRequests'] })
      message.success('Service request created successfully')
    },
    onError: (error: any) => {
      message.error(error.message || 'Failed to create service request')
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      serviceRequestService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['serviceRequests'] })
      message.success('Service request updated successfully')
    },
    onError: (error: any) => {
      message.error(error.message || 'Failed to update service request')
    },
  })

  const confirmMutation = useMutation({
    mutationFn: serviceRequestService.confirm,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['serviceRequests'] })
      message.success('Service request confirmed')
    },
    onError: (error: any) => {
      message.error(error.message || 'Failed to confirm service request')
    },
  })

  const cancelMutation = useMutation({
    mutationFn: serviceRequestService.cancel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['serviceRequests'] })
      message.success('Service request cancelled')
    },
    onError: (error: any) => {
      message.error(error.message || 'Failed to cancel service request')
    },
  })

  return {
    serviceRequests: data,
    isLoading,
    error,
    refetch,
    createServiceRequest: createMutation.mutate,
    updateServiceRequest: updateMutation.mutate,
    confirmServiceRequest: confirmMutation.mutate,
    cancelServiceRequest: cancelMutation.mutate,
  }
}

export function useServiceRequest(id: number) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['serviceRequest', id],
    queryFn: () => serviceRequestService.getById(id),
    enabled: !!id,
  })

  return {
    serviceRequest: data,
    isLoading,
    error,
  }
}
