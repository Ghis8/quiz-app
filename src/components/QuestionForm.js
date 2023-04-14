import React from 'react'

function QuestionForm({onChange}) {
  return (
    <div className='flex flex-col space-y-4'>
        <div className='flex items-center space-x-2'>
            <label className='text-gray-500'>Question:</label>
            <input type='text' name='question' placeholder='Enter Question' onChange={(event)=>setVal({...val,[event.target.name]:event.target.value})} className='py-1 indent-2 w-1/4 border border-gray-400 outline-none rounded-md' />
        </div>
        <div className='flex items-center space-x-2'>
            <label className='text-gray-500'>Answers:</label>
            <input type='text' name='answers' placeholder='Add Answers separated with commas(,)' onChange={(event)=>setVal({...val,[event.target.name]:event.target.value.split(',')})} className='py-1 indent-2 w-1/4 border border-gray-400 outline-none rounded-md' />
        </div>
        <div className='flex items-center space-x-2'>
            <label className='text-gray-500'>Correct Answer:</label>
            <input type='text' name='correct_answer' onChange={(event)=>setVal({...val,[event.target.name]:event.target.value})}  className='py-1 indent-2 w-1/4 border border-gray-400 outline-none rounded-md' />
        </div>
    </div>
  )
}

export default QuestionForm