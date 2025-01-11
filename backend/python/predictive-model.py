from flask import Flask, request, jsonify
import numpy as np
from flask_cors import CORS
import joblib
import pandas as pd
import random

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

try:
    gwa_model = joblib.load("gwa_model.pkl")
    success_rate_model = joblib.load("success_rate_model.pkl")
    grade_model = joblib.load("grade_model.pkl")
    label_encoders = joblib.load("label_encoders.pkl")
except FileNotFoundError as e:
    raise RuntimeError(f"Model loading error: {e}")

def classify_remarks(next_gwa):
    """Classifies remarks based on the predicted next GWA"""
    if next_gwa >= 90:
        return "Outstanding"
    elif 85 <= next_gwa < 90:
        return "Very Satisfactory"
    elif 80 <= next_gwa < 85:
        return "Satisfactory"
    elif 75 <= next_gwa < 80:
        return "Fairly Satisfactory"
    else:
        return "Did Not Meet Expectations"

def format_quarter_label(quarter_number):
    quarters = {1: "1st Quarter", 2: "2nd Quarter", 3: "3rd Quarter", 4: "4th Quarter"}
    return quarters.get(quarter_number, f"Quarter {quarter_number}")
    
@app.route('/ping', methods=['GET'])
def ping():
    return "Access Not Allowed", 200
    
@app.route('/')
def home():
    return "SCES ML Model Hosted By Render", 200

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Get JSON data from the POST request
        data = request.get_json()
        gwa_records = data.get('gwa_records', [])

        if not gwa_records:
            return jsonify({"error": "No GWA records provided."}), 200

        # Extract GWA values from the records
        gwa_values = [record.get("gwa", 0) for record in gwa_records]

        if len(gwa_values) == 1:
            # Handle the case where there is only one GWA record
            single_gwa = gwa_values[0]
            predicted_next_gwa = single_gwa  # Default prediction for a single GWA record
            predicted_remarks = classify_remarks(predicted_next_gwa)
            response = {
                'predicted_next_gwa': round(predicted_next_gwa, 2),
                'predicted_academic_success_rate': round(single_gwa, 2),
                'predicted_remarks': predicted_remarks,
                'predicted_performance': "Passed" if predicted_next_gwa >= 80 else "At Risk"
            }
            return jsonify(response)

        if len(gwa_values) < 2:
            return jsonify({"error": "At least two GWA records are required for prediction."}), 200

        # Calculate features from GWA values
        recent_gwa = gwa_values[-1]
        cumulative_gwa = np.mean(gwa_values)  # Cumulative mean of all GWA values
        gwa_trend = recent_gwa - gwa_values[0]

        # Prepare features as a DataFrame to retain feature names
        feature_names = ["recent_gwa", "cumulative_gwa", "gwa_trend"]
        features = pd.DataFrame([[recent_gwa, cumulative_gwa, gwa_trend]], columns=feature_names)

        # Make predictions using the GWA model
        predicted_next_gwa = float(gwa_model.predict(features)[0])  # Convert to float
        computed_success_rate = float(success_rate_model.predict(features)[0]) 
        predicted_success_rate = (computed_success_rate + predicted_next_gwa) / 2
        # Classify remarks based on predicted next GWA
        predicted_remarks = classify_remarks(predicted_next_gwa)

        # Create the response with the predicted values
        response = {
            'predicted_next_gwa': round(predicted_next_gwa, 2),
            'predicted_academic_success_rate': round(predicted_success_rate, 2),  # Use model prediction here
            'predicted_remarks': predicted_remarks,
            'predicted_performance': "Passed" if predicted_next_gwa >= 80 else "At Risk"
        }
        return jsonify(response)

    except Exception as e:
        # Return error if there's an exception in the prediction process
        return jsonify({"error": str(e)}), 500


@app.route('/interpret', methods=['POST'])
def interpret():
    try:
        # Get JSON data from the POST request
        data = request.get_json()
        gwa_records = data.get('gwa_records', [])

        if not gwa_records:
            return jsonify({"error": "No GWA records provided."}), 200

        # Extract GWA values and grade levels from the records
        gwa_values = [record.get("gwa", 0) for record in gwa_records]
        grade_levels = [record.get("grade_level", "") for record in gwa_records]

        if len(gwa_values) == 0:
            return jsonify({"message": "No GWA data available for analysis."})

        insights = []
        overall_trend = 0
        def get_random_improved_recommendation():
            recommendations = [
                "Collaborate with the student to establish clear, measurable academic goals, and track progress regularly.",
                "Encourage the use of supplementary learning materials, such as online tutorials or educational apps, to strengthen subject understanding.",
                "Provide detailed, actionable feedback on assignments and tests to highlight strengths and areas for improvement.",
                "Suggest joining peer study groups to enhance collaborative learning and deepen comprehension of key topics.",
                "Assign targeted practice exercises focused on specific skill gaps to reinforce understanding.",
                "Acknowledge and celebrate milestones in the student’s progress to boost motivation and confidence.",
                "Involve parents or guardians in creating a supportive home environment conducive to consistent study habits.",
                "Help the student develop a structured study schedule, incorporating breaks and prioritized tasks, to improve time management.",
                "Facilitate one-on-one mentorship or tutoring sessions to address specific challenges in complex subjects.",
                "Encourage the student to review past achievements and set a roadmap for continuous academic growth."
            ]

            return random.choice(recommendations)

        def get_random_decline_recommendation():
            recommendations = [
                "Establish regular one-on-one sessions with the student to identify specific academic challenges and co-develop actionable strategies for improvement.",
                "Conduct frequent progress reviews with the student, providing personalized guidance and addressing obstacles to help them get back on track.",
                "Create a structured feedback mechanism that encourages the student to share difficulties openly and enables the timely provision of tailored support.",
                "Analyze the student’s performance data to pinpoint problem areas and implement targeted interventions to address these gaps effectively.",
                "Schedule consistent check-ins with the student to offer encouragement, monitor their progress, and supply additional learning resources as needed.",
                "Facilitate open collaboration between teachers, parents, and the student to ensure a comprehensive and unified approach to overcoming academic challenges.",
                "Design periodic diagnostic assessments to track the student’s progress and make data-driven adjustments to teaching strategies and interventions.",
                "Organize focused discussions to deliver constructive feedback, address misconceptions, and clarify complex concepts effectively.",
                "Introduce a progress monitoring system that tracks weekly milestones and provides actionable recommendations for continuous improvement.",
                "Work with the student to set realistic, short-term academic goals and establish a monitoring plan to ensure consistent progress toward these objectives."
            ]
            return random.choice(recommendations)


        def get_random_stable_recommendation():
            recommendations = [
                "Encourage the student to set progressively higher academic goals and provide guidance to help them achieve these milestones, fostering continuous improvement.",
                "Promote participation in group study sessions to enhance teamwork, peer learning, and collaborative problem-solving skills.",
                "Offer specific, constructive feedback on areas for growth, while recognizing and celebrating the student’s achievements to reinforce positive behavior.",
                "Develop a personalized learning plan that leverages the student’s strengths and addresses any areas of weakness to optimize their academic performance.",
                "Encourage involvement in extracurricular activities to foster personal growth, leadership skills, and a healthy balance between academics and other interests.",
                "Introduce advanced or interdisciplinary learning projects to challenge the student and sustain their motivation and engagement in academics.",
                "Schedule regular progress review sessions to assess academic performance, provide strategic advice, and identify opportunities for further development.",
                "Promote active participation in class discussions to strengthen critical thinking, communication skills, and confidence in expressing ideas.",
                "Provide curated supplementary resources, such as online courses, interactive tools, or advanced reading materials, to enhance the student’s independent learning experience.",
                "Encourage the student to set incremental short-term goals, track their progress, and celebrate small wins to build resilience, focus, and self-discipline."
            ]
            return random.choice(recommendations)


        improvement_count = 0
        decline_count = 0
        stable_count = 0

        for i in range(1, len(gwa_values)):
            gwa_from = int(gwa_values[i - 1])
            gwa_to = int(gwa_values[i])
            diff = gwa_to - gwa_from

            if diff > 0:
                improvement_count += 1
                insights.append(
                    f"Improvement in GWA from {gwa_from} to {gwa_to} between {grade_levels[i - 1]} and {grade_levels[i]}."
                )
            elif diff < 0:
                decline_count += 1
                insights.append(
                    f"Decline in GWA from {gwa_from} to {gwa_to} between {grade_levels[i - 1]} and {grade_levels[i]}."
                )
            else:
                stable_count += 1
                insights.append(
                    f"No changes in GWA between {grade_levels[i - 1]} and {grade_levels[i]}."
                )

        # Determine the overall trend
        if improvement_count > decline_count and improvement_count > stable_count:
            overall_message = "The student's academic performance shows a notable improvement."
            recommendation = get_random_improved_recommendation()
            warning = 1
        elif decline_count > improvement_count:
            overall_message = "The student's academic performance shows a decline, indicating potential areas of difficulty."
            recommendation = get_random_decline_recommendation()
            warning = 0
        else:
            overall_message = "The student's academic performance has remained stable without significant changes."
            recommendation = get_random_stable_recommendation()
            warning = 2

        response = {
            "overall_message": overall_message,
            "insights": insights,
            "warning": warning,
            "recommendation": recommendation,
        }
        return jsonify(response)

    except Exception as e:
        # Handle exceptions
        return jsonify({"error": str(e)}), 500

@app.route('/interpret-grades', methods=['POST'])
def interpret_grades():
    try:
        def get_random_all_decent_recommendation():
            recommendations = [
                "Encourage the student to build on their strong foundation by exploring more advanced topics or enrichment opportunities across subjects.",
                "Recognize the student’s consistent efforts and motivate them to set higher academic goals to further develop their potential.",
                "Provide personalized feedback highlighting both strengths and areas for refinement to support continuous growth.",
                "Offer opportunities to participate in collaborative group projects or extracurricular activities that apply their knowledge in real-world contexts.",
                "Introduce advanced learning resources, such as educational videos or challenging practice exercises, to sustain their engagement and intellectual curiosity.",
                "Motivate the student to participate in academic competitions or advanced workshops to further hone their skills.",
                "Encourage the student to mentor peers in areas where they excel, reinforcing their understanding while building leadership skills.",
                "Develop a plan to help the student balance their academic strengths with personal interests and hobbies, fostering holistic development.",
                "Celebrate the student’s achievements through recognition, such as certificates or positive reinforcement, to maintain their motivation.",
                "Guide the student in setting long-term academic and personal goals, helping them stay focused on their growth trajectory while managing expectations."
            ]
            return random.choice(recommendations)


        def get_random_all_decline_recommendation(label):
            recommendations = [
                f"Collaborate with the student to pinpoint specific areas of difficulty within {label} and create an action plan addressing these challenges effectively.",
                f"Schedule additional one-on-one tutoring sessions focused on {label}, prioritizing the topics where the student has demonstrated the greatest need for improvement.",
                f"Encourage the student to revisit earlier lessons in {label}, providing them with structured review materials to reinforce foundational knowledge critical for advanced concepts.",
                f"Introduce engaging, interactive learning tools, such as simulations, videos, or gamified exercises, to simplify complex concepts in {label} and sustain the student’s interest.",
                f"Work closely with the student to develop a tailored, step-by-step study plan for {label}, outlining daily or weekly goals to systematically address weak points.",
                f"Implement regular progress checks and formative assessments in {label} to evaluate the student’s improvement and fine-tune teaching strategies as needed.",
                f"Provide targeted practice materials, such as problem sets or case studies, focusing on the specific topics in {label} where the student struggles the most.",
                f"Use positive reinforcement techniques, such as praise for small achievements in {label}, to build the student’s confidence and maintain their motivation to improve.",
                f"Organize collaboration with subject matter teachers to identify and address the underlying factors contributing to the student’s difficulties in {label}.",
                f"Encourage participation in group study sessions or peer learning activities centered around {label}, enabling the student to gain insights through collaborative problem-solving and discussion."
            ]
            return random.choice(recommendations)

        def generate_subject_improvement_recommendation():
            recommendations = [
                "Create a dynamic and supportive learning environment by recognizing the student's achievements and introducing advanced tasks or challenges to sustain and further their progress.",
                "Collaborate with the student to set measurable, realistic goals tailored to their strengths and areas for growth, tracking progress with regular milestones.",
                "Design a customized learning plan that targets specific areas of improvement while leveraging the student's demonstrated strengths to build confidence and ensure balanced growth.",
                "Encourage participation in collaborative learning activities, such as group projects or study circles, to improve teamwork skills and deepen understanding through peer engagement.",
                "Celebrate the student's achievements, no matter how small, and provide constructive feedback that emphasizes how these accomplishments contribute to larger academic goals.",
                "Provide structured, supplementary learning resources, such as guided exercises, concept tutorials, or one-on-one tutoring, to reinforce challenging areas of the subject.",
                "Promote active engagement in class through thought-provoking discussions, interactive activities, and problem-solving exercises designed to enhance comprehension and interest.",
                "Implement a motivational rewards system where academic achievements, such as mastering a difficult concept, are acknowledged and celebrated to maintain enthusiasm and dedication.",
                "Work closely with parents or guardians to align support strategies at home with those implemented in the classroom, ensuring consistency in addressing academic challenges.",
                "Introduce advanced learning tools and techniques, such as critical thinking exercises, analytical problem-solving tasks, or project-based learning, to prepare the student for more complex academic challenges and foster long-term success."
            ]
            return random.choice(recommendations)

        def generate_subject_decline_recommendation():
            recommendations = [
                "Conduct a thorough assessment to identify the root causes of the student's decline and create a tailored intervention plan focusing on their specific challenges.",
                "Encourage active engagement by integrating the student into collaborative discussions, group projects, or peer-learning activities to improve their comprehension and confidence.",
                "Provide structured practice exercises or dedicated one-on-one tutoring sessions to address and strengthen weak areas in the subject matter.",
                "Set clear, measurable short-term goals for the student, providing regular feedback and celebrating milestones to sustain their motivation and focus.",
                "Collaborate with parents or guardians to establish a consistent support system, sharing actionable strategies to reinforce learning at home and in school.",
                "Incorporate innovative teaching techniques, such as gamified learning, multimedia tools, or real-life applications of concepts, to make lessons more engaging and relatable to the student.",
                "Track the student’s progress through regular assessments and adjust teaching strategies or intervention plans based on emerging performance data.",
                "Introduce a rewards system that recognizes effort and improvement, fostering a positive learning environment and building the student’s confidence in their abilities.",
                "Develop a personalized and time-bound study plan, prioritizing topics that require immediate attention while building on the student’s existing knowledge base.",
                "Collaborate with fellow educators to exchange insights, share best practices, and implement cohesive strategies for supporting the student's academic recovery and growth."
            ]
            return random.choice(recommendations)

        def get_subject_unstable_recommendation():
            recommendations = [
                "Collaborate with the student to identify patterns in performance fluctuations and create a plan to address inconsistencies in understanding the subject.",
                "Encourage the student to set specific, realistic goals for each study session, fostering a habit of consistent effort and achievement.",
                "Provide detailed, actionable feedback after assessments, highlighting strengths and offering targeted advice for addressing weaknesses.",
                "Create a supportive and encouraging learning environment that helps the student regain confidence and maintain focus.",
                "Offer tailored supplementary resources, such as targeted practice exercises or personalized tutoring, to strengthen the student’s grasp of challenging concepts.",
                "Recognize and celebrate incremental achievements to keep the student motivated and reinforce a positive attitude toward learning.",
                "Develop a detailed and time-bound study plan that emphasizes areas requiring improvement while maintaining a balance with topics the student excels in.",
                "Promote collaboration with peers through group projects or study sessions, allowing the student to learn through shared perspectives and teamwork.",
                "Help the student identify and mitigate specific barriers to steady progress, such as time management issues or ineffective study habits.",
                "Implement personalized learning strategies, such as breaking down complex topics into manageable steps, to address the student’s unique needs and learning style."
            ]
            return random.choice(recommendations)

        def get_subject_nochanges_recommendation():
            recommendations = [
                "Encourage the student to set ambitious, measurable goals and provide consistent support to inspire higher academic achievements.",
                "Foster collaborative learning by recommending participation in study groups or peer-led activities that offer diverse perspectives and learning strategies.",
                "Offer detailed and constructive feedback that highlights the student’s strengths and identifies specific areas for further development.",
                "Incorporate interactive and innovative teaching methods to maintain the student’s engagement and sustain their interest in the subject.",
                "Acknowledge and celebrate milestones to build the student’s confidence and reinforce their motivation to continue excelling.",
                "Collaborate with the student to design a personalized, adaptable study plan that targets gradual improvement while tracking their progress effectively.",
                "Identify subtle challenges or overlooked areas of improvement and provide tailored resources or interventions to address these gaps.",
                "Encourage regular self-assessment to help the student reflect on their learning journey, identify improvements, and maintain steady progress.",
                "Introduce enrichment activities or advanced subject matter to nurture the student’s curiosity and promote deeper engagement with the topic.",
                "Support the student in balancing academic pursuits with recreational activities to maintain overall well-being and prevent stagnation."
            ]
            return random.choice(recommendations)

        data = request.get_json()
        subject_filter = data.get('subject_filter', 'All')
        quarter_filter = data.get('quarter_filter', 'All')
        labels = data.get('labels', [])
        bar_data = data.get('bar_data', [])

        if subject_filter == "All":
            if not labels or not bar_data:
                return jsonify({
                    "interpretation": "No data available to analyze."
                }), 200

            if len(bar_data) < 2:
                return jsonify({
                    "interpretation": "Only one grade is available, cannot perform analysis."
                    if len(bar_data) == 1 else "No grade data available for analysis."
                }), 200
            
            max_index = bar_data.index(max(bar_data))
            min_index = bar_data.index(min(bar_data))
            strength = f"{labels[max_index]}"
            weakness = f"{labels[min_index]}"
            if max(bar_data) == min(bar_data) & min(bar_data) >= 80:
                interpretation = ("The student's average grades on all subject are decent. Unable to identify the strength and weakness subject of the student.")
                recommendation = get_random_all_decent_recommendation()
                warning = 1
                strength = 0
                weakness = 0
            elif max(bar_data) == min(bar_data) & min(bar_data) < 80:
                interpretation = ("The student has an average grade below 80 for subject. Unable to identify the strength and weakness subject of the student.")
                recommendation = get_random_all_decline_recommendation(labels[min_index])
                warning = 0
                strength = 0
                weakness = 0
            else:
                if min(bar_data) < 80:
                    warning = 0
                    interpretation = ("The student has an average grade below 80 for subject.")
                    recommendation = get_random_all_decline_recommendation(labels[min_index])
                    
                else:
                    warning = 1
                    interpretation = ("The student's average grades on all subject are decent.")
                    recommendation = get_random_all_decent_recommendation()
                
            return jsonify({
                "interpretation": interpretation,
                "recommendation": recommendation,
                "warning" : warning,
                "strength" : strength,
                "weakness" : weakness,
                }), 200

        else:
            if not bar_data:
                # No grade data available for the specific subject
                return jsonify({
                    "interpretation": "No grade data is available for this subject.",
                    "trends": [],
                    "recommendation": "Please insert grades of the student in the system if source is available.",
                    "warning" : 0
                }), 200

            if len(bar_data) == 1:
                # Only one grade is available for the specific subject
                single_grade = bar_data[0]
                return jsonify({
                    "interpretation": f"The student has only one grade ({single_grade}) available for analysis in the subject.",
                    "trends": [],
                    "recommendation": "Please insert grades of the student in the system if source is available.",
                    "warning" : 0
                }), 200

            # Rest of the logic for multiple grades continues below
            if quarter_filter == "All":
                initial = "Student's Grade on subject:"
            else:
                initial = f"Student's Grade on subject every {quarter_filter} Quarter:"

            improvements = 0
            declines = 0
            no_changes = 0
            trends = []
            overall_trend = 0

            # Analyze grade trends
            for i in range(1, len(bar_data)):
                grade_from = labels[i - 1]
                grade_to = labels[i]
                score_from = bar_data[i - 1]
                score_to = bar_data[i]
                diff = score_to - score_from
                overall_trend += diff

                if diff > 0:
                    improvements += 1
                    trends.append(f"Improvement of grades from {score_from} to {score_to} in {grade_to}.")
                elif diff < 0:
                    declines += 1
                    trends.append(f"Decline of grades from {score_from} to {score_to} in {grade_to}.")
                else:
                    no_changes += 1
                    trends.append(f"No changes in grades between {score_from} in {grade_from} and {score_to} in {grade_to}.")

            # Determine overall message based on trend counts
            if improvements > declines:
                interpretation = (
                    "The student showed an improvement in performance on the subject. "
                )
                recommendation = generate_subject_improvement_recommendation()
                warning = 1
            elif declines > improvements:
                interpretation = (
                    "The student showed a decline in performance on the subject. "
                )
                recommendation = generate_subject_decline_recommendation()
                warning = 0
            elif improvements == declines and (improvements > 0 or declines > 0):
                interpretation = (
                    "The student's performance fluctuated across grade levels. "
                )
                recommendation =  get_subject_unstable_recommendation()
                warning = 0
            else:
                interpretation = (
                    "There are no significant changes in the performance of the student on the subject. "
                )
                recommendation = get_subject_nochanges_recommendation()
                warning = 0
                
            response = {
                "interpretation": interpretation,
                "trends": trends,
                "recommendation": recommendation,
                "warning": warning,
                "initial": initial,
            }
            return jsonify(response), 200


    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/interpret-subject', methods=['POST'])
def interpret_subject():
    try:
        # Get JSON data from the POST request
        data = request.get_json()
        labels = data.get('labels', [])
        bar_data = data.get('bar_data', [])
        subject_name = data.get('subject_name', "Unknown Subject")  # Default to "Unknown Subject" if not provided

        # Ensure the necessary quarters are available
        required_quarters = ["1st Quarter", "2nd Quarter", "3rd Quarter"]
        missing_quarters = [q for q in required_quarters if q not in labels]

        predicted_grade = None
        prediction_made = False

        recommendations = [
            "Analyze the student's performance in {subject} to pinpoint specific lessons or concepts that require additional attention.",
            "Focus on reinforcing the foundational concepts in {subject} to address gaps in understanding and build confidence.",
            "Provide tailored study materials or guides in {subject} to help the student review and strengthen core topics.",
            "Schedule targeted tutoring sessions in {subject} to address identified weaknesses and provide personalized support.",
            "Offer a variety of practice exercises in {subject}, focusing on both foundational and advanced topics to reinforce learning.",
            "Encourage the student to actively seek clarification on challenging areas in {subject} during or outside of class.",
            "Organize collaborative study sessions or peer discussions in {subject} to promote interactive and supportive learning.",
            "Simplify complex topics in {subject} by breaking them into smaller, manageable sections to enhance understanding.",
            "Recommend reliable online platforms or tutorials that offer interactive learning opportunities in {subject}.",
            "Establish a structured review plan in {subject}, ensuring regular and consistent practice to track improvement."
        ]

        
        def generate_recommendation(subject_name):
            recommendation = random.choice(recommendations).format(subject=subject_name)
            return recommendation
        
        # Determine the next quarter to predict
        if len(labels) < 4:
            next_quarter_number = len(labels) + 1
            next_quarter_label = format_quarter_label(next_quarter_number)

            # Check if conditions for prediction are met
            if (next_quarter_label == "2nd Quarter" and "1st Quarter" in labels) or \
               (next_quarter_label == "3rd Quarter" and all(q in labels for q in ["1st Quarter", "2nd Quarter"])) or \
               (next_quarter_label == "4th Quarter" and all(q in labels for q in ["1st Quarter", "2nd Quarter", "3rd Quarter"])):

                # Prepare feature vector for prediction
                recent_grade = bar_data[-1]
                subject_encoded = label_encoders['subject'].transform([subject_name])[0]
                quarter_encoded = label_encoders['quarter_with_label'].transform([next_quarter_label])[0]  # Use quarter_with_label

                features = pd.DataFrame({
                    'subject': [subject_encoded],
                    'quarter_with_label': [quarter_encoded],  # Correct column name
                    'previous_grade': [recent_grade]
                })

                # Predict the next grade
                predicted_grade = grade_model.predict(features)[0]
                predicted_grade = round(predicted_grade)
                predicted_grade = min(predicted_grade, 100)  # Cap grade at 100

                # Update data with prediction
                bar_data.append(predicted_grade)
                labels.append(next_quarter_label)
                prediction_made = True

        # Initialize separated messages
        prediction_message = ""
        recommendation = ("No actions required as the student's grade are above 80.")
        low_grades = ""

        # Check for unusual grades (grades or predicted grades below 80)
        if any(grade < 80 for grade in bar_data) or (predicted_grade is not None and predicted_grade < 80):
            # Collect grades and their corresponding quarters below 80
            low_grades = [
                f"{labels[i]}: {grade}" for i, grade in enumerate(bar_data) if grade < 80
            ]
                
            recommendation = generate_recommendation(subject_name)
                
        if prediction_made and predicted_grade is not None:
            prediction_message = f"Based on the previous grades, the predicted grade for the next quarter ({labels[-1]}) is {predicted_grade}. This suggests that the student {'will likely maintain an excellent academic performance in ' + subject_name if predicted_grade >= 85 else 'needs improvement in ' + subject_name}."
        elif not prediction_made and missing_quarters:
            prediction_message = f"Prediction skipped: Missing grades for {', '.join(missing_quarters)}. Please provide more data for accurate predictions."

        

        # Return JSON with separated interpretation messages
        return jsonify({
            "prediction_message": prediction_message,
            "recommendation": recommendation,
            "grades": bar_data,
            "labels": labels,
            "predicted_grade": predicted_grade,
            "next_quarter": labels[-1],
            "low_grades" : low_grades
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500




@app.route('/interpret-gwa', methods=['POST'])
def interpret_gwa():
    try:
        # Get data from the request
        data = request.get_json()
        year = data.get('year', 'All')
        grade = data.get('gradeLevel', 'All')
        labels = data.get('labels', [])
        bar_data = data.get('barData', [])
        student_counts = data.get('studentCounts', [])

        # Validate input
        if not labels or not bar_data or len(labels) != len(bar_data):
            return jsonify({
                "initial": "",
                "trends": [],
                "interpretation": "No data found for the selected filter",
                "recommendation": "Please insert data if source is available",
                "warning": 0
            }), 200

        def get_learning_strategy_recommendation():
            recommendations = [
                "Analyze grade-level performance data to identify root causes of low performance and implement targeted interventions such as tutoring, mentoring, or differentiated teaching strategies.",
                "Break down complex topics in low-performing subjects into smaller, manageable concepts, and provide tailored review sessions with supplementary materials to address gaps in understanding.",
                "Adopt interactive teaching techniques, such as group activities, hands-on experiments, and real-world applications, to engage students and enhance comprehension in challenging subjects.",
                "Encourage consistent practice through structured exercises and formative assessments, focusing on subjects where students have shown difficulty to build confidence and mastery.",
                "Establish peer mentoring programs where high-performing students provide guidance and support to classmates struggling in specific topics, fostering collaborative learning.",
                "Schedule regular progress reviews to evaluate student improvement and refine teaching approaches for subjects with historically low performance, ensuring adaptability and effectiveness.",
                "Collaborate with students to set specific, measurable improvement goals and provide personalized resources, such as study guides or practice problems, to support their academic growth.",
                "Incorporate visual aids like flowcharts, infographics, and diagrams to simplify and clarify complex concepts, making them more accessible for students facing challenges in particular subjects.",
                "Leverage technology such as interactive educational platforms, adaptive learning apps, and online resources to deliver innovative and engaging solutions for improving academic performance.",
                "Promote self-reflection by encouraging students to evaluate their study habits and develop actionable strategies for better time management and effective learning in their weak areas."
            ]
            return random.choice(recommendations)

        
        def get_specific_improvement_recommendation(selected_students, grade):
            recommendations = [
                f"Conduct a detailed analysis of assessments to identify the specific lessons or concepts that the {selected_students} students found challenging, and use this data to refine teaching strategies for {grade} students.",
                f"Provide targeted support and remedial sessions for the difficult topics identified among {selected_students} students to strengthen their foundational understanding and prepare {grade} students effectively.",
                f"Review assessment patterns to highlight recurring weak areas among {selected_students} students and create focused intervention plans for {grade} students.",
                f"Design additional practice exercises tailored to the most challenging topics faced by the {selected_students} students, ensuring {grade} students build confidence and mastery in these areas.",
                f"Organize one-on-one consultations or small group reviews to address specific difficulties faced by the {selected_students} students, and adapt these methods for {grade} students as needed.",
                f"Deliver personalized tutoring sessions for {selected_students} students that focus on high-priority challenges, and develop a proactive approach to address similar issues for {grade} students.",
                f"Host interactive workshops on the most commonly misunderstood topics among the {selected_students} students, fostering a deeper understanding that benefits future {grade} students.",
                f"Analyze subject-specific trends where {selected_students} students struggled, and implement improved teaching methods or resources to better support {grade} students in those areas.",
                f"Develop customized lesson plans targeting weak areas identified for {selected_students} students, ensuring structured and consistent improvements for {grade} students.",
                f"Encourage collaborative problem-solving activities for {selected_students} students to tackle difficult topics and apply these strategies to enhance engagement among {grade} students."
            ]
            return random.choice(recommendations)

        
        def get_specific_decent_recommendation(grade):
            recommendations = [
                f"Analyze performance trends for {grade} students to identify key areas for improvement and implement targeted strategies.",
                f"Introduce interactive, grade-appropriate activities for {grade} students to foster deeper engagement and comprehension.",
                f"Provide focused support in subjects where {grade} students typically struggle, using tailored teaching methods.",
                f"Encourage collaborative projects for {grade} students to develop teamwork, critical thinking, and problem-solving skills.",
                f"Perform a detailed assessment to pinpoint learning gaps among {grade} students and address them with focused lessons.",
                f"Organize structured revision sessions for {grade} students to reinforce core concepts and ensure retention.",
                f"Deliver personalized feedback to {grade} students, highlighting actionable steps for leveraging strengths and addressing weaknesses.",
                f"Create a positive and supportive classroom environment for {grade} students to nurture confidence and academic growth.",
                f"Adopt innovative teaching strategies tailored to the learning styles of {grade} students to sustain motivation and progress.",
                f"Regularly track the progress of {grade} students with formative assessments to identify and address challenges early."
            ]
            
            return random.choice(recommendations)

        
        def get_trend_recommendation():
            recommendations = [
                "Analyze performance trends to identify root causes of improvement or decline and adjust learning strategies accordingly.",
                "Encourage structured study routines and provide specific feedback on areas where progress is lagging.",
                "Offer targeted support for difficult topics by breaking them into smaller, manageable concepts and using practical examples.",
                "Promote consistent practice using a mix of exercises that reinforce both strengths and areas needing improvement.",
                "Develop a tailored action plan based on the student's progress, focusing on measurable milestones for improvement.",
                "Leverage strengths by integrating them into learning strategies while addressing weaker areas with focused practice sessions.",
                "Guide students in setting specific, achievable academic goals and use progress tracking tools to measure success.",
                "Provide actionable and positive feedback to build confidence and guide students toward correcting specific issues.",
                "Revise challenging concepts using interactive methods like group discussions, visual aids, or hands-on activities.",
                "Pinpoint specific skills or lessons requiring additional attention and create a focused schedule to address them."
            ]
            return random.choice(recommendations)

        
        def analyze_all_grades():
            trends = []
            max_gwa = max(bar_data)
            min_gwa = min(bar_data)
            max_gwa_index = bar_data.index(max_gwa)
            min_gwa_index = bar_data.index(min_gwa)
            warning = 1
            interpretation = ("No grade levels indicated a decline in performance.")

            below_threshold = [
                f"{labels[i]}: {gwa}, Students: {student_counts[i]}"
                for i, gwa in enumerate(bar_data)
                if gwa < 80
            ]
            
            if below_threshold:
                trends.extend(below_threshold)
                warning = 0
                interpretation = ("Significant decline in performance exist among the grade levels.")
                
            recommendation = get_learning_strategy_recommendation()
            return {
                "initial": "Average GWA below threshold:",
                "warning": warning,
                "trends": trends,
                "interpretation": interpretation,
                "recommendation": recommendation,
                "highest": (f"{labels[max_gwa_index]}: {max_gwa}, Students: {student_counts[max_gwa_index]}"),
                "lowest": (f"{labels[min_gwa_index]}: {min_gwa}, Students: {student_counts[min_gwa_index]}")
            }

        def analyze_specific_grade():
            selected_gwa = bar_data[0]
            selected_students = student_counts[0] if student_counts else 0
            trends = [f"The {selected_students} students from {grade} achieved an average GWA of {selected_gwa}"]

            if selected_gwa < 80:
                interpretation = f"The {selected_students} students from {grade} in year {year} indicates a need for improvement."
                recommendation = get_specific_improvement_recommendation(selected_students, grade)
                warning = 0
            else:
                interpretation = f"The {selected_students} students from {grade} in year {year} reflects good performance."
                recommendation = get_specific_decent_recommendation(grade)
                warning = 1
                
            return {
                "initial": f"Yearly Average GWA of {grade}:",
                "trends": trends,
                "warning": warning,
                "interpretation": interpretation,
                "recommendation": recommendation
            }

        def analyze_trends():
            trends = []
            overall_trend = 0

            for i in range(1, len(bar_data)):
                diff = bar_data[i] - bar_data[i - 1]
                overall_trend += diff
                grade_from = labels[i - 1][:4]
                grade_to = labels[i][:4]
                student_from = student_counts[i - 1]
                student_to = student_counts[i]

                if abs(diff) > 0:
                    if diff > 0:
                        trends.append(f"Improvement from {bar_data[i-1]} average GWA of {student_from} students from year {grade_from} to {bar_data[i]} average GWA of {student_to} students of year {grade_to}.")
                    elif diff < 0:
                        trends.append(f"Decline from {bar_data[i-1]} average GWA of {student_from} students from year {grade_from} to {bar_data[i]} average GWA of {student_to} students of year {grade_to}.")
                    else:
                        trends.append(f"No significant changes between average GWA of {student_from} students from year {grade_from} and average GWA of {student_to} students of year {grade_to}.")
            if trends:
                overall_message = (
                    "an improvement" if overall_trend > 0
                    else "a decline" if overall_trend < 0
                    else "no significant change"
                )
                warning = (1 if overall_trend > 0
                    else 1
                )
                return {
                    "initial": f"{grade} Average GWA:",
                    "trends": trends,
                    "warning": warning,
                    "interpretation": f"There is {overall_message} in performance of {grade} in the last school years.",
                    "recommendation": get_trend_recommendation()
                }
            else:
                return {
                    "initial": f"{grade} Average GWA:",
                    "trends": [],
                    "warning": warning,
                    "conclusion": f"The performance of {grade} students remained consistent with no major fluctuations in the last school years.",
                    "recommendation": get_trend_recommendation()
                }
        # Main logic
        if grade == "All":
            result = analyze_all_grades()
        elif year != "All" and grade != "All":
            result = analyze_specific_grade()
        else:
            result = analyze_trends()

        return jsonify(result)

    except Exception as e:
        return jsonify({
            "introduction": "An error occurred during analysis.",
            "trends": [],
            "conclusion": "Unable to process the request.",
            "recommendation": str(e)
        }), 500



if __name__ == '__main__':
    app.run(debug=True)
