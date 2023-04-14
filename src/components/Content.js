import React,{useEffect, useRef, useState} from 'react'
import {AiOutlineEdit,AiOutlinePlusSquare} from 'react-icons/ai'
import { db } from '../config/firebase'
import { getDocs,collection,addDoc,doc,updateDoc, deleteDoc } from 'firebase/firestore'
import {AiOutlineArrowLeft} from 'react-icons/ai'
import {FaTrash} from 'react-icons/fa'
import {BiBookAdd} from 'react-icons/bi'
import Nav from './Nav'
import { shuffleAnswers } from './helpers'
import { useNavigate } from 'react-router-dom'
const Content = ({create,take}) => {
  const [val,setVal]=useState({
    title:'',
    description:'',
    time:'',
    question_number:0,
    quiz:[]
  })
  const [addAnswers,setAddAnswers]=useState({
    newAnswer:''
  })
  const [addAnswer,setAddAnswer]=useState(false)
  const [questions,setQuestions]=useState({})
  let question_check=0
  const [err,setErr]=useState(false)
  const [selected,setSelected]=useState(false)
  const [qstNumb,setQstNumb]=useState([])
  const[takeQuiz,setTakeQuiz]=useState(true)
  const [quizzes,setQuizzes]=useState(null)
  const [choosedQuiz,setChoosedQuiz]=useState(null)
  const [userAnswer,setUserAnswer]=useState('')
  const [answerCount,setAnswerCount]=useState(0)
  const [timeCounter,setTimeCounter]=useState(0)
  const questionRef=useRef()
  const answerRef=useRef()
  const [showScore,setShowScore]=useState(false)
  let   [questionIndex,setQuestionIndex]=useState(0)
  const [selectedAnswer,setSelectedAnswer]=useState(false)
  const [editQuestion,setEditQuestion]=useState(false)
  const correctAnswerRef=useRef()
  const quizCollectionRef=collection(db,'quiz')
  let [score,setScore]=useState(0)
  const navigate=useNavigate()
  const addQuiz=async()=>{
    try {
      await addDoc(quizCollectionRef,{
        title:val.title,
        description:val.description,
        question_number:val.question_number,
        time:val.time,
        questions:val.quiz
      })
      setTakeQuiz(true)
    } catch (error) {
      console.log(error)
    }
  }
  const createQuiz=(event)=>{
    event.preventDefault()
    
    if(val.question_number <=0) return setErr('Number of questions must be greater than 0 to proceed')
    
    // setQstNumb([...Array(val.question_number).fill(0)])
    addQuiz()

    setErr(null)
    console.log(val)
    
  }
  const addQuestion=(event)=>{
    event.preventDefault()
    question_check+=1
    val.quiz.push(questions)
    questionRef.current.value=''
    answerRef.current.value=''
    correctAnswerRef.current.value=''
    alert('Question Added')
    console.log(val)
  }
  
  const getQuizzes=async()=>{
    //get all quizzes available in the database
    try {
      const data=await getDocs(quizCollectionRef)
      const filteredData=data.docs.map(doc=>({...doc.data(),id:doc.id}))
      setQuizzes(filteredData)
      
    } catch (error) {
      console.log(error)
    }
  }
  
  const timerCount=()=>{
    setInterval(()=>{
     setTimeCounter(choosedQuiz?.time-1)
     if(timeCounter === 0){
      clearInterval(timerCount)
      alert('you are running out of time')
     }
    },1000)
  }
  
  const updateQuiz=async(id)=>{
    const quizDoc=doc(db,'quiz',id)
     
  }
  const deleteQuiz=async(id)=>{
    const quizDoc=doc(db,'quiz',id)
    await deleteDoc(quizDoc)
  }
  const updateAnswers=async(id)=>{
    const quizDoc=doc(db,'quiz',id)
    try {
      await updateDoc(quizDoc,{"questions.answers":"answers".push(addAnswers.newAnswer)})
    } catch (error) {
      console.log(error)
    }
    
  }
  useEffect(()=>{
    getQuizzes()
  },[])
  return (
    <>
      
      <div className='flex flex-col px-4'>
        {
          editQuestion ?(
            <div className='flex flex-col space-y-4 relative'>
              <AiOutlineArrowLeft onClick={()=>{
                setTakeQuiz(false)
                }} className=' cursor-pointer text-xl'/>
              <div className='flex items-center space-x-5'>
                  <span>{choosedQuiz.title}</span>
                  <FaTrash onClick={()=>{
                    deleteQuiz(choosedQuiz.id)
                    setTakeQuiz(false)
                    }} className='text-red-500 cursor-pointer hover:scale-125'/>
              </div>
              <span>{choosedQuiz.description}</span>
              <div className=''>
                {
                  choosedQuiz.questions.map((question,index)=>(
                    <div className=''>
                      <div className='flex space-x-10 items-center'>
                        <span><span className='text-gray-500 cursor-pointer'>Question {index+1}</span> : {question.question}</span>
                        <div className='flex items-center space-x-4 cursor-pointer'>
                          
                          <AiOutlinePlusSquare  className='text-blue-500 text-xl hover:scale-125'/>
                        </div>
                      </div>
                      <div className='flex flex-col ml-10'>
                          {
                            question.answers.map((answer,i)=>(
                              <div className=' flex space-x-4 items-center'>
                                <span className='text-gray-500'>{i+1}.</span>
                                <span>{answer}</span>
                              </div>
                            ))
                          }
                      </div>
                      
                    </div>
                  ))
                }
                <BiBookAdd onClick={()=>setAddAnswer(true)} className='ml-40 text-blue-500 mt-3 text-xl'/>
              </div>
              {
                addAnswer &&(
                  <div className='flex flex-col space-y-5 w-1/4 py-2 px-4 border'>
                    <input type="text" placeholder='add answer' onChange={(e)=>setAddAnswer({...addAnswer,newAnswer:e})} className='border py-1 indent-1' />
                    <button onClick={()=>updateAnswers(choosedQuiz.id)} className='py-1 px-2 bg-blue-500 text-white w-1/5 rounded-md'>Add</button>
                  </div>
                    
                )
              }
            </div>
          ):
          selected?(
            <div className='w-3/4 mx-auto px-2 mt-5 flex flex-col space-y-2'>
              <div className='flex justify-between'>
                  <div className='flex flex-col space-y-2'>
                    <span className='text-2xl'>Title: {choosedQuiz?.title}</span>
                    <span className='text-sm text-gray-600'>Description: {choosedQuiz.description}</span>
                  </div>
                  <div className='flex  space-x-1'> 
                    <span className='text-gray-400'>Time :</span>
                    <span className='text-blue-500'>{choosedQuiz?.time}seconds</span>
                  </div>
                  
              </div>
              
              {
                showScore && questionIndex ===choosedQuiz.question_number ?(
                  <div className='flex flex-col space-y-4'>
                    <span>Thank you for completing the quiz</span>
                    <span className='font-semibold'>On a total of {choosedQuiz.question_number} Questions. Your Score is {score}/{choosedQuiz?.question_number}</span>
                  </div>
                ):
                // choosedQuiz.questions.map((question,i)=>())
                <div className='flex flex-col' >
                  <span className='text-gray-400 mr-2'>Question {questionIndex+1}:</span>
                  <span className='font-semibold text-blue-500'>{choosedQuiz.questions[questionIndex].question}</span>
                  {
                    choosedQuiz.questions[questionIndex].answers.map((answer,i)=>(
                      <div className='flex flex-col  mt-5' key={i}>
                        <span onClick={()=>{
                          setUserAnswer(answer)
                          setSelectedAnswer(userAnswer)
                          if(userAnswer === choosedQuiz.questions[questionIndex].correct_answer){
                            setAnswerCount(answerCount+1)
                            console.log(userAnswer)
                          }
                          if(userAnswer && questionIndex < choosedQuiz.question_number) questionIndex+=1
                          console.log('question=>',questionIndex)
                          }} className='py-2 px-2 rounded-full border mb-1 cursor-pointer w-2/4 ml-5 pl-5 hover:bg-blue-200'><span className='text-blue-400'>{i+1}</span>  {answer}</span>
                        
                      </div>
                    ))
                  }
                  {
                    userAnswer && questionIndex < choosedQuiz.question_number &&(
                      <button onClick={()=>{
                        if(questionIndex == choosedQuiz.question_number){
                          return setShowScore(true)
                        }
                        if(userAnswer === choosedQuiz.questions[questionIndex].correct_answer){
                          setScore(score+1)
                          if(questionIndex<choosedQuiz.question_number)setQuestionIndex(questionIndex+1)
                          return setShowScore(true)
                        }
                        if(userAnswer !== choosedQuiz.questions[questionIndex].correct_answer){
                          setScore(score+0)
                          if(questionIndex<choosedQuiz.question_number)setQuestionIndex(questionIndex+1)
                          return setShowScore(true)
                        }
                      }} className='py-2 px-4 rounded-md self-center mt-4 bg-blue-500 text-white'>next</button>
                    )
                  }
                 
                  
                </div>
              }
            </div>
          ):
          takeQuiz ?(
            <div className='flex flex-col space-y-2'>
              {
                quizzes?.map((quiz,i)=>(
                  <div onClick={()=>{
                    setChoosedQuiz({...quiz})
                    setSelected(true)
                    
                  }} key={i} className='relative flex cursor-pointer justify-between py-2 bg-gray-200 px-2 rounded-md'>
                    <div className='flex flex-col space-y-1'>
                      <span className='text-xl font-semibold text-blue-400'>{quiz?.title}</span>
                      <span className='text-sm text-gray-600'>{quiz?.description}</span>
                    </div>
                    <div className=''>
                      <AiOutlineEdit onClick={()=>{
                        setChoosedQuiz({...quiz})
                        setEditQuestion(true)
                      }} className='text-blue-400 text-2xl cursor-pointer hover:scale-125'/>
                    </div>
                    <span className='absolute bottom-1 right-2 text-xs text-gray-500'>author</span>
                  </div>
                ))
              }
            </div>
          ):
          (
            <div className=' mt-10'>
                <span className='text-2xl font-bold'>Create Quiz</span>
                <form className='mt-4 w-full mx-auto flex-col flex space-y-5 py-2' onSubmit={createQuiz}>
                  <div className='flex items-center space-x-2'>
                    <label className='text-gray-500'>Quiz Title:</label>
                    <input type='text' name='title' onChange={(event)=>setVal({...val,[event.target.name]:event.target.value})} className='py-1 indent-2 w-1/4 border border-gray-400 outline-none rounded-md' />
                  </div>
                  <div className='flex items-center space-x-2'>
                    <label className='text-gray-500'>Quiz description:</label>
                    <textarea type='text' name='description' onChange={(event)=>setVal({...val,[event.target.name]:event.target.value})} className='py-1 indent-2 w-1/4 border border-gray-400 outline-none rounded-md' />
                  </div>
                  <div className='flex items-center space-x-2'>
                    <label className='text-gray-500'>Quiz Timing:</label>
                    <input type='number' name='time' placeholder='in (min)' onChange={(event)=>setVal({...val,[event.target.name]:Number(event.target.value)*60})} className='py-1 indent-2 w-20 border border-gray-400 outline-none rounded-md' />
                  </div>
                  <div className='flex items-center space-x-2'>
                    <label className='text-gray-500'>Number of questions:</label>
                    <input type='number' name='question_number' onChange={(event)=>{
                      setVal({...val,[event.target.name]:Number(event.target.value)})
                      
                      }} className={err?'py-1 indent-2 w-20 border-2 border-red-500 outline-none rounded-md' :'py-1 indent-2 w-20 border border-gray-400 outline-none rounded-md'}/>
                  </div>
                  <div ref={questionRef} className='flex flex-col space-y-4 border-b-2 py-3' >
                        <div className='flex items-center space-x-2'>
                          <label className='text-gray-500'>Question:</label>
                          <input ref={questionRef} type='text' name='question' placeholder='Enter Question' onChange={(event)=>setQuestions({...questions,[event.target.name]:event.target.value})} className='py-1 indent-2 w-1/4 border border-gray-400 outline-none rounded-md' />
                        </div>
                        <div className='flex items-center space-x-2'>
                          <label className='text-gray-500'>Answers:</label>
                          <input ref={answerRef} type='text'  name='answers' placeholder='Add Answers separated with commas(,)' onChange={(event)=>setQuestions({...questions,[event.target.name]:event.target.value.split(',')})} className='py-1 indent-2 w-2/4 border border-gray-400 outline-none rounded-md' />
                        </div>
                        <div className='flex items-center space-x-2'>
                          <label className='text-gray-500'>Correct Answer:</label>
                          <input ref={correctAnswerRef} type='text' name='correct_answer' onChange={(event)=>setQuestions({...questions,[event.target.name]:event.target.value})}  className='py-1 indent-2 w-1/4 border border-gray-400 outline-none rounded-md' />
                        </div>
                        {
                          val.quiz.length < val.question_number &&
                          <button onClick={addQuestion}  className='text-white bg-blue-500 py-2 px-3 w-16 rounded-md text-center'>Add</button>
                        }
                        
                  </div>
                  {/* {
                    val.question_number>0 && qstNumb.map((q,i)=>(
                      <div className='flex flex-col space-y-4 border-b-2 py-3' key={i}>
                        <span className='font-semibold'>*Question Number {i+1}</span>
                        <div className='flex items-center space-x-2'>
                          <label className='text-gray-500'>Question:</label>
                          <input type='text' name='question' placeholder='Enter Question' onChange={(event)=>setQuestions([...questions,{question:event.target.value}])} className='py-1 indent-2 w-1/4 border border-gray-400 outline-none rounded-md' />
                        </div>
                        <div className='flex items-center space-x-2'>
                          <label className='text-gray-500'>Answers:</label>
                          <input type='text' name='answers' placeholder='Add Answers separated with commas(,)' onChange={(event)=>setQuestions([...questions,{...i,answers:event.target.value.split(',')}])} className='py-1 indent-2 w-2/4 border border-gray-400 outline-none rounded-md' />
                        </div>
                        <div className='flex items-center space-x-2'>
                          <label className='text-gray-500'>Correct Answer:</label>
                          <input type='text' name='correct_answer' onChange={(event)=>setQuestions([...questions,{...i,correct_answer:event.target.value}])}  className='py-1 indent-2 w-1/4 border border-gray-400 outline-none rounded-md' />
                        </div>
                        <button onClick={addQuestion}>Add</button>
                      </div>
                    ))
                  } */}

                  
                  {
                    err && <span className='text-red-500'>*{err}</span>
                  }
                  
                  <button type='submit' className='w-1/6 bg-blue-500 py-2 px-3 rounded-md text-white font-semibold'>{val.question_number===0 ? 'Questions':'Create Quiz'}</button>
                </form>
            </div>
          )
        }
          
      </div>
    </>
  )
}

export default Content