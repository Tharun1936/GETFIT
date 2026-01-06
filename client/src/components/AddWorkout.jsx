import React, { memo, useCallback, useState, useEffect } from 'react'
import styled from "styled-components"
import TextInput from "./TextInput"
import Button from "./Button"
import { Save, BookmarkBorder, Bookmark } from "@mui/icons-material";
import { createWorkoutTemplate, getWorkoutTemplates, deleteWorkoutTemplate } from "../api";

const Card = styled.div`
  flex: 1;
  min-width: 280px;
  padding: 24px;
  border: 1px solid ${({ theme }) => theme.text_primary + 20};
  border-radius: 14px;
  box-shadow: 1px 6px 20px 0px ${({ theme }) => theme.primary + 15};
  display: flex;
  flex-direction: column;
  gap: 6px;
  @media (max-width: 600px) {
    padding: 16px;
  }
`
const Title = styled.div`
  font-weight: 600;
  font-size: 16px;
  color: ${({ theme }) => theme.primary};
  @media (max-width: 600px) {
    font-size: 14px;
  }
`

const TemplatesSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid ${({ theme }) => theme.text_primary + 20};
`;

const TemplateButton = styled.button`
  padding: 10px 16px;
  border: 1px solid ${({ theme }) => theme.text_primary + 40};
  border-radius: 8px;
  background: transparent;
  color: ${({ theme }) => theme.text_primary};
  font-size: 14px;
  text-align: left;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  justify-content: space-between;
  align-items: center;

  &:hover {
    background: ${({ theme }) => theme.primary + 20};
    border-color: ${({ theme }) => theme.primary};
  }
`;

const TemplateName = styled.div`
  font-weight: 500;
`;

const TemplateDetails = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.text_secondary};
  margin-top: 4px;
`;

// note prop name changed to `addNewWorkout`
const AddWorkout = memo(({ workout, setWorkout, addNewWorkout, buttonLoading }) => {
  const [templates, setTemplates] = useState([]);
  const [showTemplates, setShowTemplates] = useState(false);
  const [savingTemplate, setSavingTemplate] = useState(false);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const res = await getWorkoutTemplates();
      if (res?.data?.templates) {
        setTemplates(res.data.templates);
      }
    } catch (err) {
      console.error("Failed to fetch templates:", err);
    }
  };

  const handleClick = useCallback(() => {
    if (typeof addNewWorkout !== "function") {
      console.error("addNewWorkout prop is not a function:", addNewWorkout);
      alert("Action not available. Please try again.");
      return;
    }
    addNewWorkout();
  }, [addNewWorkout]);

  const handleChange = useCallback((e) => {
    setWorkout(e.target.value);
  }, [setWorkout]);

  const handleSaveTemplate = async () => {
    if (!workout.trim()) {
      alert("Please enter a workout first");
      return;
    }

    const name = prompt("Enter a name for this template:");
    if (!name) return;

    setSavingTemplate(true);
    try {
      // Parse workout to extract details
      const lines = workout.split(/\n/).map(l => l.trim()).filter(l => l.length > 0);
      const categoryLine = lines.find(l => l.startsWith("#"));
      const workoutLine = lines.find(l => l.startsWith("-") && !l.includes("sets"));

      if (!categoryLine || !workoutLine) {
        alert("Invalid workout format. Please use the correct format.");
        return;
      }

      const category = categoryLine.substring(1).trim();
      const workoutName = workoutLine.substring(1).trim();
      
      // Try to extract sets, reps, weight, duration
      const setsMatch = workout.match(/(\d+)\s*sets/i);
      const repsMatch = workout.match(/(\d+)\s*reps/i);
      const weightMatch = workout.match(/(\d+)\s*kg/i);
      const durationMatch = workout.match(/(\d+)\s*min/i);

      await createWorkoutTemplate({
        name,
        category,
        workoutName,
        sets: setsMatch ? parseInt(setsMatch[1]) : 0,
        reps: repsMatch ? parseInt(repsMatch[1]) : 0,
        weight: weightMatch ? parseFloat(weightMatch[1]) : 0,
        duration: durationMatch ? parseFloat(durationMatch[1]) : 0,
      });

      alert("Template saved successfully!");
      fetchTemplates();
    } catch (err) {
      console.error("Failed to save template:", err);
      alert("Failed to save template");
    } finally {
      setSavingTemplate(false);
    }
  };

  const handleLoadTemplate = (template) => {
    const templateString = `#${template.category}
-${template.workoutName}
-${template.sets} setsX${template.reps} reps
-${template.weight} kg
-${template.duration} min`;
    setWorkout(templateString);
    setShowTemplates(false);
  };

  const handleDeleteTemplate = async (templateId, e) => {
    e.stopPropagation();
    if (!window.confirm("Delete this template?")) return;

    try {
      await deleteWorkoutTemplate(templateId);
      alert("Template deleted!");
      fetchTemplates();
    } catch (err) {
      console.error("Failed to delete template:", err);
      alert("Failed to delete template");
    }
  };

  return (
    <Card>
      <Title>Add New Workout</Title>
      <TextInput
        label="Workout"
        textArea
        rows={13}
        placeholder={`Enter in this format:

#Category
-Workout Name
-Sets
-Reps
-Weight
-Duration`}
        value={workout}
        handelChange={handleChange}
      />
      <div style={{ display: 'flex', gap: '8px', flexDirection: 'column' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button
            text="Add Workout"
            small
            flex
            onClick={handleClick}
            isLoading={buttonLoading}
            isDisabled={buttonLoading}
          />
          <Button
            text="Save Template"
            small
            outlined
            leftIcon={<Save />}
            onClick={handleSaveTemplate}
            isLoading={savingTemplate}
            isDisabled={savingTemplate || !workout.trim()}
          />
        </div>

        {templates.length > 0 && (
          <Button
            text={showTemplates ? "Hide Templates" : "Load Template"}
            small
            outlined
            leftIcon={showTemplates ? <Bookmark /> : <BookmarkBorder />}
            onClick={() => setShowTemplates(!showTemplates)}
          />
        )}

        {showTemplates && templates.length > 0 && (
          <TemplatesSection>
            <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>
              Saved Templates ({templates.length})
            </div>
            {templates.map((template) => (
              <TemplateButton
                key={template._id}
                onClick={() => handleLoadTemplate(template)}
              >
                <div style={{ flex: 1 }}>
                  <TemplateName>{template.name}</TemplateName>
                  <TemplateDetails>
                    {template.category} • {template.workoutName} • {template.sets} sets × {template.reps} reps
                  </TemplateDetails>
                </div>
                <button
                  onClick={(e) => handleDeleteTemplate(template._id, e)}
                  style={{
                    padding: '6px',
                    border: 'none',
                    background: 'transparent',
                    color: 'inherit',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    opacity: 0.7
                  }}
                  onMouseEnter={(e) => e.target.style.opacity = '1'}
                  onMouseLeave={(e) => e.target.style.opacity = '0.7'}
                >
                  <Delete sx={{ fontSize: '18px' }} />
                </button>
              </TemplateButton>
            ))}
          </TemplatesSection>
        )}
      </div>
    </Card>
  );
});

AddWorkout.displayName = "AddWorkout";

export default AddWorkout;
