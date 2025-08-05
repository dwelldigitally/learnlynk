import { CampaignService } from './campaignService';

interface DummyCampaignData {
  name: string;
  description: string;
  campaign_type: string;
  status: string;
  target_audience: any;
  workflow_config: any;
  steps: Array<{
    step_type: string;
    step_config: any;
    order_index: number;
  }>;
}

const dummyCampaigns: DummyCampaignData[] = [
  {
    name: "New Lead Welcome Series",
    description: "Comprehensive welcome series for new leads to introduce programs and build engagement",
    campaign_type: "email",
    status: "active",
    target_audience: {
      segments: ["new_leads"],
      criteria: {
        status: "new",
        created_within_days: 1
      }
    },
    workflow_config: {
      trigger_type: "lead_created",
      duration: "7 days",
      channels: ["email", "sms", "phone"]
    },
    steps: [
      {
        step_type: "email",
        order_index: 0,
        step_config: {
          subject: "Welcome to [Institution Name] - Your Educational Journey Starts Here!",
          content: "Dear {{first_name}},\n\nWelcome to [Institution Name]! We're excited you've shown interest in advancing your education with us.\n\nThis email marks the beginning of your personalized journey with our admissions team. Over the next few days, you'll receive valuable information about our programs, success stories from our alumni, and guidance on the application process.\n\nBest regards,\nAdmissions Team",
          template_id: null,
          send_immediately: true
        }
      },
      {
        step_type: "wait",
        order_index: 1,
        step_config: {
          duration: 2,
          unit: "hours"
        }
      },
      {
        step_type: "email",
        order_index: 2,
        step_config: {
          subject: "Explore Our Programs - Find Your Perfect Match",
          content: "Hi {{first_name}},\n\nReady to discover which program aligns with your career goals?\n\nAttached you'll find our comprehensive program guide with detailed information about:\n- Course curricula and learning outcomes\n- Career opportunities and alumni success rates\n- Admission requirements and prerequisites\n- Tuition and financial aid options\n\nWe've also included a personalized program recommendation based on your interests.\n\nHave questions? Reply to this email or call us at [phone number].\n\nBest regards,\nProgram Advisors",
          attachments: ["program_guide.pdf", "financial_aid_info.pdf"]
        }
      },
      {
        step_type: "wait",
        order_index: 3,
        step_config: {
          duration: 2,
          unit: "days"
        }
      },
      {
        step_type: "call",
        order_index: 4,
        step_config: {
          title: "Personal consultation call",
          description: "Schedule a personal consultation call to discuss program options and answer questions",
          assigned_to_role: "advisor",
          priority: "medium",
          duration: 30
        }
      },
      {
        step_type: "wait",
        order_index: 5,
        step_config: {
          duration: 3,
          unit: "days"
        }
      },
      {
        step_type: "sms",
        order_index: 6,
        step_config: {
          content: "Hi {{first_name}}! Ready to take the next step? Complete your application here: [application_link]. Questions? Text HELP or call [phone]. - [Institution Name]",
          send_time: "business_hours"
        }
      }
    ]
  },
  {
    name: "Application Incomplete Recovery",
    description: "Gentle nudge campaign for leads who started but didn't complete their applications",
    campaign_type: "email",
    status: "active",
    target_audience: {
      segments: ["incomplete_applications"],
      criteria: {
        application_status: "incomplete",
        last_activity_days_ago: 3
      }
    },
    workflow_config: {
      trigger_type: "application_abandoned",
      duration: "7 days",
      channels: ["email", "sms"]
    },
    steps: [
      {
        step_type: "email",
        order_index: 0,
        step_config: {
          subject: "Complete Your Application in Just 5 Minutes",
          content: "Hi {{first_name}},\n\nWe noticed you started your application but haven't had a chance to finish it yet. No worries - it happens to the best of us!\n\nYour progress has been saved, and you can complete the remaining sections in just about 5 minutes. Here's what's left:\n{{remaining_sections}}\n\nClick here to continue: {{application_link}}\n\nIf you're facing any technical issues or have questions, our support team is here to help.\n\nBest regards,\nAdmissions Support Team"
        }
      },
      {
        step_type: "wait",
        order_index: 1,
        step_config: {
          duration: 1,
          unit: "days"
        }
      },
      {
        step_type: "sms",
        order_index: 2,
        step_config: {
          content: "Hi {{first_name}}! Your application is almost complete. Finish it now: {{short_link}}. Need help? Contact us at {{support_phone}}. - {{institution_name}}"
        }
      },
      {
        step_type: "wait",
        order_index: 3,
        step_config: {
          duration: 3,
          unit: "days"
        }
      },
      {
        step_type: "email",
        order_index: 4,
        step_config: {
          subject: "Final Reminder: Application Deadline Extension Available",
          content: "Dear {{first_name}},\n\nWe understand that life can get busy, and sometimes important tasks like completing your application fall by the wayside.\n\nBecause we believe in your potential and want to give you every opportunity to succeed, we're extending your application deadline by 48 hours.\n\nThis is your final opportunity to:\n✓ Complete your application\n✓ Secure your spot in the upcoming intake\n✓ Take advantage of early-bird tuition rates\n\nComplete your application now: {{application_link}}\n\nIf you need assistance or have decided not to proceed, please let us know by replying to this email.\n\nWe're rooting for you!\nAdmissions Team"
        }
      }
    ]
  },
  {
    name: "Healthcare Program Nurture Campaign",
    description: "Specialized nurture sequence for healthcare program prospects with industry insights and success stories",
    campaign_type: "email",
    status: "draft",
    target_audience: {
      segments: ["healthcare_interested"],
      criteria: {
        program_interest: ["nursing", "healthcare_administration", "medical_assistant"],
        engagement_level: "medium_to_high"
      }
    },
    workflow_config: {
      trigger_type: "program_interest",
      duration: "3 weeks",
      channels: ["email", "phone"]
    },
    steps: [
      {
        step_type: "email",
        order_index: 0,
        step_config: {
          subject: "Healthcare Industry Insights: What Employers Really Want",
          content: "Dear {{first_name}},\n\nThe healthcare industry is evolving rapidly, and employers are looking for professionals with specific skills and qualifications.\n\nIn this week's industry insight, we're sharing:\n• Top 5 skills healthcare employers value most in 2024\n• Emerging career opportunities in healthcare technology\n• How our programs prepare students for these in-demand roles\n• Salary trends and job market outlook\n\nDownload the full report: {{report_link}}\n\nStay ahead of the curve,\nHealthcare Program Team"
        }
      },
      {
        step_type: "wait",
        order_index: 1,
        step_config: {
          duration: 1,
          unit: "weeks"
        }
      },
      {
        step_type: "email",
        order_index: 2,
        step_config: {
          subject: "From Student to Healthcare Leader: Sarah's Success Story",
          content: "Hi {{first_name}},\n\nMeet Sarah Martinez, one of our healthcare administration graduates who went from student to department manager in just 18 months.\n\n\"The program didn't just teach me healthcare management - it taught me how to lead teams, analyze data, and make decisions that impact patient care. The real-world projects and internship opportunities made all the difference.\"\n\n- Sarah Martinez, Healthcare Administration Graduate, Class of 2023\n- Current Position: Operations Manager at Regional Medical Center\n- Starting Salary: $65,000\n\nRead Sarah's full story and see how our program can accelerate your healthcare career: {{success_story_link}}\n\nInspired to start your journey?\nHealthcare Program Team"
        }
      },
      {
        step_type: "wait",
        order_index: 3,
        step_config: {
          duration: 3,
          unit: "days"
        }
      },
      {
        step_type: "call",
        order_index: 4,
        step_config: {
          title: "Healthcare program consultation",
          description: "Personalized consultation about healthcare career paths and program options",
          assigned_to_role: "healthcare_advisor",
          priority: "high",
          duration: 45
        }
      },
      {
        step_type: "wait",
        order_index: 5,
        step_config: {
          duration: 1,
          unit: "weeks"
        }
      },
      {
        step_type: "email",
        order_index: 6,
        step_config: {
          subject: "Scholarships Available: Healthcare Career Investment Opportunities",
          content: "Dear {{first_name}},\n\nInvesting in your healthcare education is investing in a stable, rewarding future. To help make this investment more accessible, we're proud to offer several scholarship opportunities:\n\n🏆 Healthcare Heroes Scholarship - Up to $5,000\n🏆 First-Generation Student Grant - Up to $3,000  \n🏆 Career Changer Scholarship - Up to $2,500\n🏆 Early Application Scholarship - $1,000\n\nEligibility requirements and application deadlines:\n{{scholarship_details}}\n\nMany of our students combine multiple scholarships to significantly reduce their tuition costs.\n\nApply for scholarships: {{scholarship_application_link}}\n\nDon't let finances delay your healthcare career!\nFinancial Aid Team"
        }
      },
      {
        step_type: "wait",
        order_index: 7,
        step_config: {
          duration: 2,
          unit: "days"
        }
      },
      {
        step_type: "email",
        order_index: 8,
        step_config: {
          subject: "Healthcare Program Application Deadline Approaching",
          content: "Hi {{first_name}},\n\nTime flies when you're planning your future! Our next healthcare program intake begins in just {{days_until_start}} days, and the application deadline is {{application_deadline}}.\n\nHere's what you need to complete your application:\n✓ Online application form (15 minutes)\n✓ Official transcripts\n✓ Personal statement\n✓ Letters of recommendation\n\nAlready started? Log in to check your progress: {{application_status_link}}\nReady to begin? Start your application: {{application_link}}\n\nOur admissions team is standing by to help with any questions.\n\nYour healthcare career awaits!\nAdmissions Team"
        }
      }
    ]
  },
  {
    name: "Cold Lead Reactivation",
    description: "Re-engagement campaign for leads who haven't interacted with communications in 30+ days",
    campaign_type: "email",
    status: "active",
    target_audience: {
      segments: ["cold_leads"],
      criteria: {
        last_engagement_days_ago: 30,
        status: ["contacted", "qualified"],
        no_recent_applications: true
      }
    },
    workflow_config: {
      trigger_type: "lead_cold",
      duration: "14 days",
      channels: ["email", "sms", "phone"]
    },
    steps: [
      {
        step_type: "email",
        order_index: 0,
        step_config: {
          subject: "We miss you, {{first_name}}! Here's what you've been missing...",
          content: "Hi {{first_name}},\n\nIt's been a while since we last connected, and we wanted to reach out to see how you're doing with your educational goals.\n\nLife has a way of getting busy, and sometimes our dreams get pushed to the back burner. But here's the thing - it's never too late to pursue the career you've always wanted.\n\nSince we last spoke, here's what's new:\n• New program options and specializations\n• Enhanced online learning capabilities\n• Additional scholarship opportunities\n• Flexible scheduling options for working professionals\n\nIf you're still interested in advancing your education, we'd love to reconnect and see how we can help make it happen.\n\nReply to this email or give us a call at {{phone_number}}.\n\nWe believe in your potential,\n{{advisor_name}}"
        }
      },
      {
        step_type: "wait",
        order_index: 1,
        step_config: {
          duration: 3,
          unit: "days"
        }
      },
      {
        step_type: "email",
        order_index: 2,
        step_config: {
          subject: "Special Offer: 15% Tuition Discount for Returning Prospects",
          content: "Dear {{first_name}},\n\nWe hope our previous message found you well. Because we value the interest you previously showed in our programs, we'd like to extend a special offer exclusively for you.\n\n🎓 LIMITED TIME OFFER 🎓\n15% Tuition Discount on Any Program\nValid for applications submitted by {{offer_expiry_date}}\nPromo Code: WELCOME15\n\nThis exclusive discount can be applied to:\n• All certificate programs\n• Associate degree programs  \n• Bachelor's degree programs\n• Professional development courses\n\nNo hidden fees. No complicated requirements. Just our way of saying \"welcome back.\"\n\nClaim your discount: {{application_link}}?promo=WELCOME15\n\nQuestions about the offer? Reply to this email or call {{phone_number}}.\n\nThis offer expires in {{days_remaining}} days.\n\nWe hope to welcome you back,\nEnrollment Team"
        }
      },
      {
        step_type: "wait",
        order_index: 3,
        step_config: {
          duration: 1,
          unit: "weeks"
        }
      },
      {
        step_type: "sms",
        order_index: 4,
        step_config: {
          content: "Hi {{first_name}}! Your 15% tuition discount expires in 48 hours. Don't miss this opportunity to restart your education journey. Apply now: {{short_link}} Questions? Call {{phone}}."
        }
      },
      {
        step_type: "call",
        order_index: 5,
        step_config: {
          title: "Cold lead reactivation call",
          description: "Personal outreach call to re-engage cold lead and discuss current educational goals",
          assigned_to_role: "senior_advisor",
          priority: "medium",
          duration: 20
        }
      }
    ]
  },
  {
    name: "Event Registration Follow-up",
    description: "Complete follow-up sequence for prospects who register for information sessions or campus tours",
    campaign_type: "event",
    status: "active",
    target_audience: {
      segments: ["event_registrants"],
      criteria: {
        event_registration: true,
        event_type: ["info_session", "campus_tour", "open_house"]
      }
    },
    workflow_config: {
      trigger_type: "event_registration",
      duration: "7 days",
      channels: ["email", "sms"]
    },
    steps: [
      {
        step_type: "email",
        order_index: 0,
        step_config: {
          subject: "Registration Confirmed: {{event_name}} on {{event_date}}",
          content: "Dear {{first_name}},\n\nThank you for registering for {{event_name}}! We're excited to meet you and help you learn more about our programs.\n\nEvent Details:\n📅 Date: {{event_date}}\n🕐 Time: {{event_time}}\n📍 Location: {{event_location}}\n🎯 What to Expect: {{event_agenda}}\n\nTo help us prepare for your visit:\n• Please arrive 15 minutes early for check-in\n• Bring a list of questions about programs you're interested in\n• Valid ID required for campus tours\n• Free parking available in visitor lots A & B\n\nWhat to Bring:\n✓ Government-issued ID\n✓ Questions about programs\n✓ Notebook for taking notes\n\nEvent confirmation: {{event_confirmation_link}}\nDirections to campus: {{directions_link}}\nParking information: {{parking_link}}\n\nCan't make it? No problem - reschedule here: {{reschedule_link}}\n\nLooking forward to meeting you!\nEvents Team"
        }
      },
      {
        step_type: "wait",
        order_index: 1,
        step_config: {
          duration: 1,
          unit: "days",
          condition: "before_event"
        }
      },
      {
        step_type: "sms",
        order_index: 2,
        step_config: {
          content: "Reminder: {{event_name}} tomorrow at {{event_time}}. Location: {{event_location}}. Arrive 15 min early. Directions: {{short_directions_link}} See you there! - {{institution_name}}"
        }
      },
      {
        step_type: "wait",
        order_index: 3,
        step_config: {
          duration: 1,
          unit: "days",
          condition: "after_event"
        }
      },
      {
        step_type: "email",
        order_index: 4,
        step_config: {
          subject: "Thank you for attending {{event_name}} - Next Steps",
          content: "Hi {{first_name}},\n\nIt was wonderful meeting you at {{event_name}} yesterday! We hope you found the information helpful and got answers to your questions about our programs.\n\nAs promised, here are your next steps:\n\n📋 Resources Mentioned:\n• Program brochures: {{brochure_links}}\n• Financial aid information: {{financial_aid_link}}\n• Student success stories: {{success_stories_link}}\n• Career outcomes data: {{outcomes_link}}\n\n🎯 Ready to Apply?\nStart your application: {{application_link}}\nSchedule a one-on-one consultation: {{consultation_link}}\n\n💬 Have More Questions?\nEmail us: {{admissions_email}}\nCall us: {{phone_number}}\nLive chat: {{chat_link}}\n\n⏰ Important Dates:\nApplication deadline: {{application_deadline}}\nNext intake start date: {{intake_start_date}}\nScholarship deadline: {{scholarship_deadline}}\n\nRemember, early applications receive priority consideration for scholarships and preferred class scheduling.\n\nWe're here to support you every step of the way. Don't hesitate to reach out with any questions!\n\nBest regards,\n{{advisor_name}}\nAdmissions Advisor"
        }
      }
    ]
  }
];

export class DummyCampaignService {
  static async createDummyCampaigns(): Promise<void> {
    try {
      console.log('Creating dummy campaigns...');
      
      for (const campaignData of dummyCampaigns) {
        // Create the campaign
        const campaign = await CampaignService.createCampaign({
          name: campaignData.name,
          description: campaignData.description,
          campaign_type: campaignData.campaign_type,
          status: campaignData.status,
          target_audience: campaignData.target_audience,
          workflow_config: campaignData.workflow_config,
          start_date: new Date().toISOString(),
          end_date: null
        });

        console.log(`Created campaign: ${campaign.name}`);

        // Create the campaign steps
        for (const stepData of campaignData.steps) {
          await CampaignService.createCampaignStep({
            campaign_id: campaign.id,
            step_type: stepData.step_type,
            step_config: stepData.step_config,
            order_index: stepData.order_index,
            is_active: true
          });
        }

        console.log(`Created ${campaignData.steps.length} steps for ${campaign.name}`);
      }

      console.log('All dummy campaigns created successfully!');
    } catch (error) {
      console.error('Error creating dummy campaigns:', error);
      throw error;
    }
  }

  static async clearDummyCampaigns(): Promise<void> {
    try {
      const campaigns = await CampaignService.getCampaigns();
      const dummyCampaignNames = dummyCampaigns.map(c => c.name);
      
      for (const campaign of campaigns) {
        if (dummyCampaignNames.includes(campaign.name)) {
          await CampaignService.deleteCampaign(campaign.id);
          console.log(`Deleted dummy campaign: ${campaign.name}`);
        }
      }
      
      console.log('All dummy campaigns cleared!');
    } catch (error) {
      console.error('Error clearing dummy campaigns:', error);
      throw error;
    }
  }
}