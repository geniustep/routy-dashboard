import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { serviceRequestService } from '@/api/services/serviceRequestService'
import { message } from 'ant-design-vue'
import type { ServiceRequestFormData } from '@/types/models/ServiceRequest'
import i18n from '@/locales'

export function useServiceRequests(filters?: any) {
  const queryClient = useQueryClient()

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['serviceRequests', filters],
    queryFn: () => serviceRequestService.getAll(filters),
  })

  const createMutation = useMutation({
    mutationFn: (data: ServiceRequestFormData) => serviceRequestService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['serviceRequests'] })
      message.success(i18n.global.t('serviceRequests.messages.createSuccess'))
    },
    onError: (error: any) => {
      message.error(error.message || i18n.global.t('serviceRequests.messages.createError'))
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      serviceRequestService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['serviceRequests'] })
      message.success(i18n.global.t('serviceRequests.messages.updateSuccess'))
    },
    onError: (error: any) => {
      message.error(error.message || i18n.global.t('serviceRequests.messages.updateError'))
    },
  })

  const confirmMutation = useMutation({
    mutationFn: serviceRequestService.confirm,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['serviceRequests'] })
      message.success(i18n.global.t('serviceRequests.messages.confirmSuccess'))
    },
    onError: (error: any) => {
      message.error(error.message || i18n.global.t('serviceRequests.messages.confirmError'))
    },
  })

  const cancelMutation = useMutation({
    mutationFn: serviceRequestService.cancel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['serviceRequests'] })
      message.success(i18n.global.t('serviceRequests.messages.cancelSuccess'))
    },
    onError: (error: any) => {
      message.error(error.message || i18n.global.t('serviceRequests.messages.cancelError'))
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
