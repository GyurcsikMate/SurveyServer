import { Router, Request, Response, NextFunction } from "express";
import { MainClass } from "../main-class";
import { PassportStatic } from "passport";
import { User } from "../model/User";
import Survey, { ISurvey } from "../model/Survey";
import SurveyResponse from "../model/SurveyResponse";

export const configureRoutes = (
  passport: PassportStatic,
  router: Router
): Router => {
  router.get("/", (req: Request, res: Response) => {
    let myClass = new MainClass();
    res.status(200).send("Hello, World!");
  });

  router.get("/callback", (req: Request, res: Response) => {
    let myClass = new MainClass();
    myClass.monitoringCallback((error, result) => {
      if (error) {
        res.write(error);
        res.status(400).end();
      } else {
        res.write(result);
        res.status(200).end();
      }
    });
  });

  router.get("/promise", async (req: Request, res: Response) => {
    let myClass = new MainClass();
    /* myClass.monitoringPromise().then((data: string) => {
            res.write(data);
            res.status(200).end();
        }).catch((error: string) => {
            res.write(error);
            res.status(400).end();
        }); */

    // async-await
    try {
      const data = await myClass.monitoringPromise();
      res.write(data);
      res.status(200).end();
    } catch (error) {
      res.write(error);
      res.status(400).end();
    }
  });

  router.get("/observable", (req: Request, res: Response) => {
    let myClass = new MainClass();
    res.setHeader("Content-Type", "text/html; charset=UTF-8");
    res.setHeader("Transfer-Encoding", "chunked");

    myClass.monitoringObservable().subscribe({
      next(data: string) {
        res.write(data);
      },
      error(error: string) {
        res.status(400).end(error);
      },
      complete() {
        res.status(200).end();
      },
    });
  });


  router.post("/login", (req: Request, res: Response, next: NextFunction) => {
    console.log(req);
    passport.authenticate(
      "local",
      (error: string | null, user: typeof User) => {
        if (error) {
          console.log(error);
          res.status(500).send(error);
        } else {
          if (!user) {
            res.status(400).send("User not found.");
          } else {
            req.login(user, (err: string | null) => {
              if (err) {
                console.log(err);
                res.status(500).send("Internal server error.");
              } else {
                res.status(200).send(user);
              }
            });
          }
        }
      }
    )(req, res, next);
  });

  router.post("/register", (req: Request, res: Response) => {
    const email = req.body.email;
    const password = req.body.password;
    const user = new User({ email: email, password: password });
    user
      .save()
      .then((data) => {
        res.status(200).send(data);
      })
      .catch((error) => {
        res.status(500).send(error);
      });
  });

  router.post("/logout", (req: Request, res: Response) => {
    if (req.isAuthenticated()) {
      req.logout((error) => {
        if (error) {
          console.log(error);
          res.status(500).send("Internal server error.");
        }
        res.status(200).send("Successfully logged out.");
      });
    } else {
      res.status(500).send("User is not logged in.");
    }
  });

  router.get('/users', async (req: Request, res: Response) => {
    try {
      const surveys = await User.find();
      res.json(surveys);
    } catch (err:any) {
      res.status(500).json({ message: err.message });
    }
  });



router.get('/surveys', async (req: Request, res: Response) => {
  try {
    const surveys = await Survey.find();
    res.json(surveys);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/surveys', async (req: Request, res: Response) => {
  const survey = new Survey(req.body);
  try {
    const newSurvey = await survey.save();
    let user = await User.findById(newSurvey.owner_id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.own_surveys.push(newSurvey);
    await user.save();
    res.status(201).json(newSurvey);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

router.get('/surveys/:id', async (req: Request, res: Response) => {
  try {
    const survey = await Survey.findById(req.params.id);
    if (!survey) {
      return res.status(404).json({ message: 'Survey not found' });
    }
    res.json(survey);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.patch('/surveys/:id', async (req: Request, res: Response) => {
  try {
    const survey = await Survey.findById(req.params.id);
    if (!survey) {
      return res.status(404).json({ message: 'Survey not found' });
    }
    survey.set(req.body);
    const updatedSurvey = await survey.save();
    res.json(updatedSurvey);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/surveys/:id', async (req: Request, res: Response) => {
  try {
    const survey = await Survey.findById(req.params.id);
    if (!survey) {
      return res.status(404).json({ message: 'Survey not found' });
    }
    let user = await User.findById(survey.owner_id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }let index:any;
    for( index in user.own_surveys){
      if(user.own_surveys[index]._id==req.params.id &&index > -1){
          user.own_surveys.splice(index, 1); // 2nd parameter means remove one item only
      }
    }
    await user.save();
    res.json({ message: 'Survey deleted' });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// Routes for SurveyResponse CRUD operations
router.get('/survey-responses', async (req: Request, res: Response) => {
  try {
    const surveyResponses = await SurveyResponse.find();
    res.json(surveyResponses);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/survey-responses', async (req: Request, res: Response) => {
  const surveyResponse = new SurveyResponse(req.body);
  try {
    
    const newSurveyResponse = await surveyResponse.save();
    //itt a usert egészítem ki, hogy kitoltotte
    let user = await User.findById(newSurveyResponse.survey_responder_id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.completed_surveys.push(newSurveyResponse);
    await user.save();
    //itt a surveybe rakjuk bele a kitoltest
    let survey = await Survey.findById(newSurveyResponse.survey_id);
    if (!survey) {
      return res.status(404).json({ message: 'Survey not found' });
    }
    survey.responses.push(newSurveyResponse._id);
    await survey.save();
    res.status(201).json(newSurveyResponse);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

router.get('/survey-responses/:id', async (req: Request, res: Response) => {
  try {
    const surveyResponse = await SurveyResponse.findById(req.params.id);
    if (!surveyResponse) {
      return res.status(404).json({ message: 'Survey response not found' });
    }
    res.json(surveyResponse);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.patch('/survey-responses/:id', async (req: Request, res: Response) => {
  try {
    const surveyResponse = await SurveyResponse.findById(req.params.id);
    if (!surveyResponse) {
      return res.status(404).json({ message: 'Survey response not found' });
    }
    surveyResponse.set(req.body);
    const updatedSurveyResponse = await surveyResponse.save();
    res.json(updatedSurveyResponse);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/survey-responses/:id', async (req: Request, res: Response) => {
  try {
    const surveyResponse = await SurveyResponse.findById(req.params.id);
    if (!surveyResponse) {
      return res.status(404).json({ message: 'Survey response not found' });
    }
    await surveyResponse.deleteOne();
    //itt a usert egészítem ki, hogy kitoltotte
    let user = await User.findById(surveyResponse.survey_responder_id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    let index:any
    for( index in user.completed_surveys){
      if(user.completed_surveys[index]._id==req.params.id && index > -1){
          user.completed_surveys.splice(index, 1); // 2nd parameter means remove one item only
      }
    }
    await user.save();
    //itt a surveybe rakjuk bele a kitoltest
    let survey = await Survey.findById(surveyResponse.survey_id);
    if (!survey) {
      return res.status(404).json({ message: 'Survey not found' });
    }
    let ind:any
    for( ind in survey.responses){
      if(survey.responses[ind]==req.params.id && ind > -1){
        survey.responses.splice(ind, 1); // 2nd parameter means remove one item only
      }
    }
    await survey.save();
    res.json({ message: 'Survey response deleted' });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});


  
  return router;
}


