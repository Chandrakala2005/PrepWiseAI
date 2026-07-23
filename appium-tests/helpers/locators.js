/**
 * Centralized Locator Registry for PrepWiseAI Android Application
 * Supports Accessibility ID, Resource ID, Text, and XPath strategies.
 */
module.exports = {
    // Auth & Onboarding
    auth: {
        welcomeHeader: '~welcome_header',
        emailInput: '//*[@content-desc="email_input" or @resource-id="com.prepwise.ai:id/email_input"]',
        passwordInput: '//*[@content-desc="password_input" or @resource-id="com.prepwise.ai:id/password_input"]',
        loginButton: '~login_button',
        signupButton: '~signup_button',
        googleAuthButton: '~google_auth_button',
        forgotPasswordLink: '~forgot_password_link',
        errorMessageText: '//*[@resource-id="com.prepwise.ai:id/error_message"]',
        otpInput: '//*[@resource-id="com.prepwise.ai:id/otp_input"]',
        verifyOtpButton: '~verify_otp_button'
    },

    // Onboarding Setup
    onboarding: {
        roleDropdown: '~select_role_dropdown',
        roleOptionSoftwareEngineer: '//*[@text="Software Engineer"]',
        experienceSlider: '~experience_slider',
        skillChipJava: '//*[@text="Java / Kotlin"]',
        skillChipSystemDesign: '//*[@text="System Design"]',
        skillChipDataStructures: '//*[@text="Data Structures & Algorithms"]',
        targetCompanyInput: '//*[@resource-id="com.prepwise.ai:id/target_company_input"]',
        completeOnboardingButton: '~complete_onboarding_btn'
    },

    // Home Dashboard
    dashboard: {
        greetingBanner: '//*[@resource-id="com.prepwise.ai:id/greeting_banner"]',
        streakCounter: '//*[@resource-id="com.prepwise.ai:id/streak_counter"]',
        startMockInterviewCard: '~start_mock_interview_card',
        practiceCodingCard: '~practice_coding_card',
        recentScoresWidget: '//*[@resource-id="com.prepwise.ai:id/recent_scores_widget"]',
        navHome: '~nav_home',
        navInterviews: '~nav_interviews',
        navAnalytics: '~nav_analytics',
        navProfile: '~nav_profile'
    },

    // AI Mock Interview Setup & Session
    interview: {
        topicSelector: '~select_interview_topic',
        difficultyEasy: '//*[@text="Easy"]',
        difficultyMedium: '//*[@text="Medium"]',
        difficultyHard: '//*[@text="Hard"]',
        durationSelector: '~select_duration',
        aiPersonaSelector: '~select_ai_interviewer_persona',
        startSessionButton: '~start_session_button',

        // Live Session
        avatarVideoView: '//*[@resource-id="com.prepwise.ai:id/ai_avatar_view"]',
        questionText: '//*[@resource-id="com.prepwise.ai:id/question_text"]',
        timerCountdown: '//*[@resource-id="com.prepwise.ai:id/timer_countdown"]',
        micToggleButton: '~mic_toggle_btn',
        camToggleButton: '~cam_toggle_btn',
        speechTranscriptionText: '//*[@resource-id="com.prepwise.ai:id/speech_transcript"]',
        textAnswerInput: '//*[@resource-id="com.prepwise.ai:id/text_answer_input"]',
        submitAnswerButton: '~submit_answer_button',
        nextQuestionButton: '~next_question_button',
        endInterviewButton: '~end_interview_button'
    },

    // AI Feedback & Analytics
    feedback: {
        overallScoreText: '//*[@resource-id="com.prepwise.ai:id/overall_score"]',
        technicalScoreBar: '//*[@resource-id="com.prepwise.ai:id/tech_score_bar"]',
        communicationScoreBar: '//*[@resource-id="com.prepwise.ai:id/comm_score_bar"]',
        confidenceScoreBar: '//*[@resource-id="com.prepwise.ai:id/conf_score_bar"]',
        keyStrengthsList: '//*[@resource-id="com.prepwise.ai:id/strengths_list"]',
        improvementAreasList: '//*[@resource-id="com.prepwise.ai:id/improvements_list"]',
        aiDetailedCritique: '//*[@resource-id="com.prepwise.ai:id/ai_critique"]',
        downloadPdfReportBtn: '~download_pdf_report_btn',
        shareResultsBtn: '~share_results_btn'
    },

    // Profile & Settings
    profile: {
        profileName: '//*[@resource-id="com.prepwise.ai:id/profile_name"]',
        editProfileBtn: '~edit_profile_btn',
        uploadResumeBtn: '~upload_resume_btn',
        parsedResumeSkills: '//*[@resource-id="com.prepwise.ai:id/parsed_skills"]',
        darkModeSwitch: '~dark_mode_switch',
        notificationsSwitch: '~notifications_switch',
        logoutButton: '~logout_button'
    }
};
