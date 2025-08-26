import { AcademicJourneyService } from './academicJourneyService';
import type { JourneyTemplate, JourneyTemplateData } from '@/types/academicJourney';

export class JourneyTemplateSeeder {
  static async seedSystemTemplates() {
    const templates = this.getSystemTemplates();
    
    try {
      for (const template of templates) {
        await AcademicJourneyService.createJourneyTemplate(template);
      }
      console.log('Journey templates seeded successfully');
    } catch (error) {
      console.error('Error seeding journey templates:', error);
    }
  }

  private static getSystemTemplates(): Partial<JourneyTemplate>[] {
    return [
      {
        name: 'Business Administration (Simple)',
        description: 'Standard business program with straightforward requirements',
        category: 'business',
        program_type: 'undergraduate',
        complexity_level: 'simple',
        estimated_duration_days: 45,
        is_system_template: true,
        usage_count: 0,
        template_data: {
          stages: [
            {
              name: 'Initial Inquiry',
              description: 'Student expresses interest in the program',
              stage_type: 'lead_capture',
              order_index: 0,
              timing_config: {
                stall_threshold_days: 2,
                expected_duration_days: 1,
                business_hours_only: false
              },
              requirements: [
                {
                  name: 'Contact Information',
                  requirement_type: 'form',
                  is_mandatory: true,
                  validation_rules: {}
                }
              ],
              channel_rules: [
                {
                  channel_type: 'email',
                  is_allowed: true,
                  priority_threshold: 'medium',
                  conditions: {}
                },
                {
                  channel_type: 'call',
                  is_allowed: true,
                  priority_threshold: 'high',
                  conditions: {}
                }
              ]
            },
            {
              name: 'Application Started',
              description: 'Student begins formal application process',
              stage_type: 'application_start',
              order_index: 1,
              timing_config: {
                stall_threshold_days: 7,
                expected_duration_days: 3,
                business_hours_only: false
              },
              requirements: [
                {
                  name: 'Online Application',
                  requirement_type: 'form',
                  is_mandatory: true,
                  validation_rules: {}
                }
              ],
              channel_rules: [
                {
                  channel_type: 'email',
                  is_allowed: true,
                  priority_threshold: 'medium',
                  conditions: {}
                },
                {
                  channel_type: 'sms',
                  is_allowed: true,
                  priority_threshold: 'medium',
                  conditions: {}
                }
              ]
            },
            {
              name: 'Documents Pending',
              description: 'Required documents collection and verification',
              stage_type: 'documents',
              order_index: 2,
              timing_config: {
                stall_threshold_days: 7,
                expected_duration_days: 5,
                business_hours_only: true
              },
              requirements: [
                {
                  name: 'High School Transcript',
                  requirement_type: 'document',
                  is_mandatory: true,
                  validation_rules: {
                    allowed_formats: ['pdf', 'jpg', 'png'],
                    max_file_size_mb: 5
                  }
                },
                {
                  name: 'Government ID',
                  requirement_type: 'document',
                  is_mandatory: true,
                  validation_rules: {
                    allowed_formats: ['pdf', 'jpg', 'png'],
                    max_file_size_mb: 3
                  }
                }
              ],
              channel_rules: [
                {
                  channel_type: 'email',
                  is_allowed: true,
                  priority_threshold: 'low',
                  conditions: {}
                },
                {
                  channel_type: 'portal_message',
                  is_allowed: true,
                  priority_threshold: 'medium',
                  conditions: {}
                }
              ]
            },
            {
              name: 'Evaluation',
              description: 'Application review and assessment',
              stage_type: 'prerequisites',
              order_index: 3,
              timing_config: {
                stall_threshold_days: 5,
                expected_duration_days: 3,
                business_hours_only: true
              },
              requirements: [
                {
                  name: 'Admissions Review',
                  requirement_type: 'verification',
                  is_mandatory: true,
                  validation_rules: {}
                }
              ],
              channel_rules: [
                {
                  channel_type: 'email',
                  is_allowed: true,
                  priority_threshold: 'medium',
                  conditions: {}
                }
              ]
            },
            {
              name: 'Offer Extended',
              description: 'Admission decision communicated to student',
              stage_type: 'admission_decision',
              order_index: 4,
              timing_config: {
                stall_threshold_days: 14,
                expected_duration_days: 7,
                business_hours_only: false
              },
              requirements: [
                {
                  name: 'Offer Response',
                  requirement_type: 'form',
                  is_mandatory: true,
                  validation_rules: {}
                }
              ],
              channel_rules: [
                {
                  channel_type: 'email',
                  is_allowed: true,
                  priority_threshold: 'high',
                  conditions: {}
                },
                {
                  channel_type: 'call',
                  is_allowed: true,
                  priority_threshold: 'high',
                  conditions: {}
                }
              ]
            },
            {
              name: 'Deposit & Enrollment',
              description: 'Enrollment confirmation and deposit collection',
              stage_type: 'deposit_payment',
              order_index: 5,
              timing_config: {
                stall_threshold_days: 7,
                expected_duration_days: 2,
                business_hours_only: false
              },
              requirements: [
                {
                  name: 'Enrollment Deposit',
                  requirement_type: 'payment',
                  is_mandatory: true,
                  validation_rules: {}
                }
              ],
              channel_rules: [
                {
                  channel_type: 'email',
                  is_allowed: true,
                  priority_threshold: 'medium',
                  conditions: {}
                }
              ]
            },
            {
              name: 'Pre-Enrollment',
              description: 'Orientation and preparation for program start',
              stage_type: 'enrollment_complete',
              order_index: 6,
              timing_config: {
                stall_threshold_days: 14,
                expected_duration_days: 10,
                business_hours_only: true
              },
              requirements: [
                {
                  name: 'Orientation Attendance',
                  requirement_type: 'verification',
                  is_mandatory: true,
                  validation_rules: {}
                }
              ],
              channel_rules: [
                {
                  channel_type: 'email',
                  is_allowed: true,
                  priority_threshold: 'medium',
                  conditions: {}
                },
                {
                  channel_type: 'portal_message',
                  is_allowed: true,
                  priority_threshold: 'low',
                  conditions: {}
                }
              ]
            }
          ],
          default_timings: {
            stall_threshold_days: 7,
            business_hours_only: true
          },
          communication_rules: [
            {
              channel_type: 'email',
              is_allowed: true,
              priority_threshold: 'low',
              conditions: {}
            }
          ]
        }
      },
      {
        name: 'Health Care Assistant (Strict)',
        description: 'Healthcare program with rigorous requirements and interview process',
        category: 'healthcare',
        program_type: 'certificate',
        complexity_level: 'complex',
        estimated_duration_days: 60,
        is_system_template: true,
        usage_count: 0,
        template_data: {
          stages: [
            {
              name: 'Initial Inquiry',
              description: 'Student expresses interest in healthcare program',
              stage_type: 'lead_capture',
              order_index: 0,
              timing_config: {
                stall_threshold_days: 1,
                expected_duration_days: 1,
                business_hours_only: false
              },
              requirements: [
                {
                  name: 'Contact Information',
                  requirement_type: 'form',
                  is_mandatory: true,
                  validation_rules: {}
                },
                {
                  name: 'Program Interest Survey',
                  requirement_type: 'form',
                  is_mandatory: true,
                  validation_rules: {}
                }
              ],
              channel_rules: [
                {
                  channel_type: 'email',
                  is_allowed: true,
                  priority_threshold: 'medium',
                  conditions: {}
                },
                {
                  channel_type: 'call',
                  is_allowed: true,
                  priority_threshold: 'high',
                  conditions: {}
                }
              ]
            },
            {
              name: 'Application Submitted',
              description: 'Formal application with preliminary screening',
              stage_type: 'application_start',
              order_index: 1,
              timing_config: {
                stall_threshold_days: 5,
                expected_duration_days: 3,
                business_hours_only: true
              },
              requirements: [
                {
                  name: 'Complete Application',
                  requirement_type: 'form',
                  is_mandatory: true,
                  validation_rules: {}
                },
                {
                  name: 'Healthcare Experience Declaration',
                  requirement_type: 'form',
                  is_mandatory: true,
                  validation_rules: {}
                }
              ],
              channel_rules: [
                {
                  channel_type: 'email',
                  is_allowed: true,
                  priority_threshold: 'medium',
                  conditions: {}
                },
                {
                  channel_type: 'call',
                  is_allowed: true,
                  priority_threshold: 'medium',
                  conditions: {}
                }
              ]
            },
            {
              name: 'Document Collection',
              description: 'Comprehensive document verification including health records',
              stage_type: 'documents',
              order_index: 2,
              timing_config: {
                stall_threshold_days: 5,
                expected_duration_days: 7,
                business_hours_only: true
              },
              requirements: [
                {
                  name: 'High School Diploma/GED',
                  requirement_type: 'document',
                  is_mandatory: true,
                  validation_rules: {
                    allowed_formats: ['pdf'],
                    max_file_size_mb: 5
                  }
                },
                {
                  name: 'Government Photo ID',
                  requirement_type: 'document',
                  is_mandatory: true,
                  validation_rules: {
                    allowed_formats: ['pdf', 'jpg', 'png'],
                    max_file_size_mb: 3
                  }
                },
                {
                  name: 'Immunization Records',
                  requirement_type: 'document',
                  is_mandatory: true,
                  validation_rules: {
                    allowed_formats: ['pdf'],
                    max_file_size_mb: 5
                  }
                },
                {
                  name: 'Police Background Check',
                  requirement_type: 'document',
                  is_mandatory: true,
                  validation_rules: {
                    allowed_formats: ['pdf'],
                    max_file_size_mb: 5,
                    expiration_days: 180
                  }
                }
              ],
              channel_rules: [
                {
                  channel_type: 'email',
                  is_allowed: true,
                  priority_threshold: 'low',
                  conditions: {}
                },
                {
                  channel_type: 'portal_message',
                  is_allowed: true,
                  priority_threshold: 'medium',
                  conditions: {}
                },
                {
                  channel_type: 'call',
                  is_allowed: true,
                  priority_threshold: 'high',
                  conditions: {}
                }
              ]
            },
            {
              name: 'Interview Required',
              description: 'Mandatory personal interview and assessment',
              stage_type: 'interview',
              order_index: 3,
              timing_config: {
                stall_threshold_days: 3,
                expected_duration_days: 5,
                business_hours_only: true
              },
              requirements: [
                {
                  name: 'Personal Interview',
                  requirement_type: 'interview',
                  is_mandatory: true,
                  validation_rules: {}
                },
                {
                  name: 'Basic Skills Assessment',
                  requirement_type: 'test',
                  is_mandatory: true,
                  validation_rules: {
                    min_score: 70
                  }
                }
              ],
              channel_rules: [
                {
                  channel_type: 'email',
                  is_allowed: true,
                  priority_threshold: 'high',
                  conditions: {}
                },
                {
                  channel_type: 'call',
                  is_allowed: true,
                  priority_threshold: 'high',
                  conditions: {}
                },
                {
                  channel_type: 'video_call',
                  is_allowed: true,
                  priority_threshold: 'medium',
                  conditions: {}
                }
              ]
            },
            {
              name: 'Final Evaluation',
              description: 'Comprehensive application review and decision',
              stage_type: 'prerequisites',
              order_index: 4,
              timing_config: {
                stall_threshold_days: 3,
                expected_duration_days: 2,
                business_hours_only: true
              },
              requirements: [
                {
                  name: 'Admissions Committee Review',
                  requirement_type: 'verification',
                  is_mandatory: true,
                  validation_rules: {}
                }
              ],
              channel_rules: [
                {
                  channel_type: 'email',
                  is_allowed: true,
                  priority_threshold: 'medium',
                  conditions: {}
                }
              ]
            },
            {
              name: 'Conditional Offer',
              description: 'Offer extended with specific conditions',
              stage_type: 'admission_decision',
              order_index: 5,
              timing_config: {
                stall_threshold_days: 10,
                expected_duration_days: 5,
                business_hours_only: false
              },
              requirements: [
                {
                  name: 'Offer Acceptance',
                  requirement_type: 'form',
                  is_mandatory: true,
                  validation_rules: {}
                },
                {
                  name: 'Health Clearance',
                  requirement_type: 'document',
                  is_mandatory: true,
                  validation_rules: {
                    allowed_formats: ['pdf'],
                    expiration_days: 90
                  }
                }
              ],
              channel_rules: [
                {
                  channel_type: 'email',
                  is_allowed: true,
                  priority_threshold: 'high',
                  conditions: {}
                },
                {
                  channel_type: 'call',
                  is_allowed: true,
                  priority_threshold: 'high',
                  conditions: {}
                }
              ]
            },
            {
              name: 'Enrollment Confirmation',
              description: 'Final enrollment and deposit processing',
              stage_type: 'deposit_payment',
              order_index: 6,
              timing_config: {
                stall_threshold_days: 5,
                expected_duration_days: 2,
                business_hours_only: false
              },
              requirements: [
                {
                  name: 'Enrollment Deposit',
                  requirement_type: 'payment',
                  is_mandatory: true,
                  validation_rules: {}
                },
                {
                  name: 'Program Agreement',
                  requirement_type: 'form',
                  is_mandatory: true,
                  validation_rules: {}
                }
              ],
              channel_rules: [
                {
                  channel_type: 'email',
                  is_allowed: true,
                  priority_threshold: 'medium',
                  conditions: {}
                }
              ]
            },
            {
              name: 'Pre-Program Preparation',
              description: 'Orientation, uniform ordering, and final preparations',
              stage_type: 'enrollment_complete',
              order_index: 7,
              timing_config: {
                stall_threshold_days: 10,
                expected_duration_days: 14,
                business_hours_only: true
              },
              requirements: [
                {
                  name: 'Orientation Session',
                  requirement_type: 'verification',
                  is_mandatory: true,
                  validation_rules: {}
                },
                {
                  name: 'Uniform & Supplies Order',
                  requirement_type: 'verification',
                  is_mandatory: true,
                  validation_rules: {}
                },
                {
                  name: 'Clinical Placement Forms',
                  requirement_type: 'document',
                  is_mandatory: true,
                  validation_rules: {}
                }
              ],
              channel_rules: [
                {
                  channel_type: 'email',
                  is_allowed: true,
                  priority_threshold: 'medium',
                  conditions: {}
                },
                {
                  channel_type: 'portal_message',
                  is_allowed: true,
                  priority_threshold: 'low',
                  conditions: {}
                },
                {
                  channel_type: 'in_person',
                  is_allowed: true,
                  priority_threshold: 'high',
                  conditions: {}
                }
              ]
            }
          ],
          default_timings: {
            stall_threshold_days: 5,
            business_hours_only: true
          },
          communication_rules: [
            {
              channel_type: 'email',
              is_allowed: true,
              priority_threshold: 'low',
              conditions: {}
            }
          ]
        }
      },
      {
        name: 'Certificate Program (Fast Track)',
        description: 'Accelerated certificate program with streamlined process',
        category: 'certificate',
        program_type: 'certificate',
        complexity_level: 'simple',
        estimated_duration_days: 21,
        is_system_template: true,
        usage_count: 0,
        template_data: {
          stages: [
            {
              name: 'Express Inquiry',
              description: 'Fast-track inquiry and initial qualification',
              stage_type: 'lead_capture',
              order_index: 0,
              timing_config: {
                stall_threshold_days: 1,
                expected_duration_days: 1,
                business_hours_only: false
              },
              requirements: [
                {
                  name: 'Quick Application',
                  requirement_type: 'form',
                  is_mandatory: true,
                  validation_rules: {}
                }
              ],
              channel_rules: [
                {
                  channel_type: 'email',
                  is_allowed: true,
                  priority_threshold: 'high',
                  conditions: {}
                },
                {
                  channel_type: 'sms',
                  is_allowed: true,
                  priority_threshold: 'high',
                  conditions: {}
                },
                {
                  channel_type: 'call',
                  is_allowed: true,
                  priority_threshold: 'high',
                  conditions: {}
                }
              ]
            },
            {
              name: 'Document Upload',
              description: 'Essential documents only',
              stage_type: 'documents',
              order_index: 1,
              timing_config: {
                stall_threshold_days: 2,
                expected_duration_days: 1,
                business_hours_only: false
              },
              requirements: [
                {
                  name: 'ID Verification',
                  requirement_type: 'document',
                  is_mandatory: true,
                  validation_rules: {
                    allowed_formats: ['pdf', 'jpg', 'png'],
                    max_file_size_mb: 3
                  }
                }
              ],
              channel_rules: [
                {
                  channel_type: 'email',
                  is_allowed: true,
                  priority_threshold: 'medium',
                  conditions: {}
                },
                {
                  channel_type: 'sms',
                  is_allowed: true,
                  priority_threshold: 'medium',
                  conditions: {}
                }
              ]
            },
            {
              name: 'Quick Review',
              description: 'Expedited application review',
              stage_type: 'prerequisites',
              order_index: 2,
              timing_config: {
                stall_threshold_days: 1,
                expected_duration_days: 1,
                business_hours_only: true
              },
              requirements: [
                {
                  name: 'Fast Track Review',
                  requirement_type: 'verification',
                  is_mandatory: true,
                  validation_rules: {}
                }
              ],
              channel_rules: [
                {
                  channel_type: 'email',
                  is_allowed: true,
                  priority_threshold: 'high',
                  conditions: {}
                }
              ]
            },
            {
              name: 'Immediate Enrollment',
              description: 'Same-day offer and enrollment',
              stage_type: 'admission_decision',
              order_index: 3,
              timing_config: {
                stall_threshold_days: 3,
                expected_duration_days: 1,
                business_hours_only: false
              },
              requirements: [
                {
                  name: 'Enrollment Payment',
                  requirement_type: 'payment',
                  is_mandatory: true,
                  validation_rules: {}
                }
              ],
              channel_rules: [
                {
                  channel_type: 'email',
                  is_allowed: true,
                  priority_threshold: 'high',
                  conditions: {}
                },
                {
                  channel_type: 'call',
                  is_allowed: true,
                  priority_threshold: 'high',
                  conditions: {}
                }
              ]
            },
            {
              name: 'Program Start',
              description: 'Immediate program commencement',
              stage_type: 'enrollment_complete',
              order_index: 4,
              timing_config: {
                stall_threshold_days: 3,
                expected_duration_days: 2,
                business_hours_only: true
              },
              requirements: [
                {
                  name: 'Access Setup',
                  requirement_type: 'verification',
                  is_mandatory: true,
                  validation_rules: {}
                }
              ],
              channel_rules: [
                {
                  channel_type: 'email',
                  is_allowed: true,
                  priority_threshold: 'medium',
                  conditions: {}
                },
                {
                  channel_type: 'portal_message',
                  is_allowed: true,
                  priority_threshold: 'low',
                  conditions: {}
                }
              ]
            }
          ],
          default_timings: {
            stall_threshold_days: 2,
            business_hours_only: false
          },
          communication_rules: [
            {
              channel_type: 'email',
              is_allowed: true,
              priority_threshold: 'low',
              conditions: {}
            }
          ]
        }
      }
    ];
  }
}