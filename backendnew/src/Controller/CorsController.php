<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class CorsController extends AbstractController
{
    public function preflight(): JsonResponse
    {
        // Empty 204 response; NelmioCorsBundle will add the appropriate CORS headers.
        return new JsonResponse(null, Response::HTTP_NO_CONTENT);
    }
}
